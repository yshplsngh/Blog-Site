import {apiSlice} from "../../App/API/apiSlice.ts";
import {resNotesArrayType, resType} from "../../Types/feature.note.ts";
import {createEntityAdapter, createSelector} from "@reduxjs/toolkit";
import {RootState} from "../../App/store.ts";

const notesAdapter = createEntityAdapter()
const initialState = notesAdapter.getInitialState()

export const notesApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder)=>({
        getNotes:builder.query({
            query:()=>({
                url:'note/getAllNotes',
                method:'GET',
            }),
            transformResponse:(response:resType)=>{
                const resArray = response.message as resNotesArrayType[]
                const newResponse = resArray.map(singlePost=>{
                    singlePost.id = singlePost._id
                    return singlePost
                })
                return notesAdapter.setAll(initialState,newResponse)
            },
            providesTags: (result) => {
                if(result?.ids){
                    return [
                        {type:'Note' , id:'LIST'},
                        ...result.ids.map(id=>({type:'Note' as const,id}))
                    ]
                }else return [{type:'Note',id:'LIST'}]
            }
        }),
        createNote:builder.mutation({
            query:initialData=>({
                url:'note/createNote',
                method:'POST',
                body:{...initialData}
            }),
            invalidatesTags:()=>[
                {type:'Note',id:'LIST'}
            ]
        }),
        updateNote:builder.mutation({
            query:initialNote=>({
                url:'note/updateNote',
                method:'PATCH',
                body:{...initialNote}
            }),
            invalidatesTags:(arg)=>[
                {type:'Note',id:arg.id}
            ]
        }),
        deleteNote:builder.mutation({
            query:({id})=>({
                url:'note/deleteNote',
                method:'DELETE',
                body:{id}
            }),
            invalidatesTags:(arg)=>[
                {type:'Note',id:arg.id}
            ]
        })
    })
})

export const {
    useGetNotesQuery,
    useCreateNoteMutation,
    useUpdateNoteMutation,
    useDeleteNoteMutation
} = notesApiSlice

export const selectNotesResult = notesApiSlice.endpoints.getNotes.select("notesList");

const selectNotesData = createSelector(
    selectNotesResult,
    notesResult=>notesResult.data
)
// console.log(selectNotesData)
export const {
    selectAll: selectAllNotes,
    selectById: selectNoteById,
    selectIds: selectNoteIds
} = notesAdapter.getSelectors<RootState>((state:RootState)=>selectNotesData(state) ?? initialState)

