import {apiSlice} from "../../App/API/apiSlice.ts";
import {logOut, setCredential} from "./authSlice.ts";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints:builder=> ({
        login: builder.mutation({
            query: credentials =>({
              url:'auth/login',
              method:'POST',
              body:{...credentials}
            })
        }),

        signup:builder.mutation({
            query:initialUserData=>({
                url:'/auth/signup',
                method:'POST',
                body:{...initialUserData}
            })
        }),

        refresh:builder.mutation({
            query:()=>({
                url:'auth/refresh',
                method:'GET'
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try{
                    const {data} = await queryFulfilled
                    const accessToken = data.message.accessToken
                    dispatch(setCredential({accessToken}))
                }catch(err){
                    console.log(err+"appa")
                }
            }
        }),

        sendLogOut:builder.mutation({
            query:()=>({
                url:'/auth/logOut',
                method:"GET"
            }),
            async onQueryStarted(_,{dispatch,queryFulfilled}){
                try {
                    await queryFulfilled
                    // console.log(data)
                    dispatch(logOut())
                    setTimeout(()=>{
                        dispatch(apiSlice.util?.resetApiState())
                    },1000)
                }catch (err){
                    // console.log(err)
                    console.log(err+"appa")
                }
            }
        })
    })
})

export const {
    useLoginMutation,
    useSignupMutation
} = authApiSlice