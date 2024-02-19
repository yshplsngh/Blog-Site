import {lazy} from "react";

export type lazyJSXType = React.LazyExoticComponent<()=>React.ReactElement>

export interface routeType{
    path:string,
    element:lazyJSXType
}

const NotesList:lazyJSXType = lazy(()=>import('./pages/Notes/NotesList.tsx'))
const EditNote:lazyJSXType = lazy(()=>import('./pages/Notes/EditNote.tsx'))
const ViewNote:lazyJSXType = lazy(()=>import('./pages/Notes/ViewNote.tsx'))
const CreateNewNote:lazyJSXType = lazy(()=>import('./pages/Notes/CreateNewNote.tsx'))

export const NoteRoutes:routeType[] = [
    {
        path:'',
        element:NotesList
    },
    {
        path:'/dash/notes/new',
        element:CreateNewNote
    },
    {
        path:'/dash/notes/edit/:noteId',
        element:EditNote
    },
    {
        path:'/dash/notes/view/:noteId',
        element:ViewNote
    }
]