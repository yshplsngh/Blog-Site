import React, {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../../App/store.ts";
import {selectUserById, useDeleteUserMutation} from "../../features/admin/adminApiSlice.ts";
import {resUsersArrayType} from "../../Types/feature.admin.ts";
import {useNavigate} from "react-router-dom";
import Loading from "../../components/Loading.tsx";
import {errTypo} from "../../Types/feature.auth.ts";
import {resetError, setError} from "../../features/auth/authSlice.ts";

// import {setError} from "../../features/auth/authSlice.ts";

interface userIdType {
    userId: string | number
}

const SingleUserRow = React.memo(({userId}: userIdType) => {
    const user = useSelector((state: RootState) => selectUserById(state, String(userId))) as resUsersArrayType
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [deleteUser,
        {isSuccess, isLoading, isError, error}
    ] = useDeleteUserMutation()

    useEffect(() => {
        if (isSuccess) {
            dispatch(resetError())
        }
        if (isError){
            const err = error as errTypo
            dispatch(setError({errMsg: err?.data?.message}))
        }
        return()=>{
            dispatch(resetError())
        }
    }, [isSuccess,isError]);


    let content;
    if (user as resUsersArrayType) {
        const handleView = () => {
            navigate(`/dash/users/detail/${userId}`)
        }
        const handleDelete = async () => {
            await deleteUser({id: userId})
        }


        if (isLoading) {
            content = <tr>
                <td><Loading/></td>
            </tr>
        } else {
            content = (
                <tr>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isActive ? <p className={'activeUser'}>Active</p> :
                        <p className={'blockedUser'}>Blocked</p>}</td>
                    <td>{user.notes.length}</td>
                    <td>
                        <button onClick={handleView}>View detail</button>
                    </td>
                    <td>
                        <button onClick={handleDelete}>Delete User</button>
                    </td>
                </tr>
            )
        }
    }
    return content
})
export default SingleUserRow