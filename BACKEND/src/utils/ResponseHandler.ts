import {SafeParseError} from "zod";
import {loginType} from "../types/authTypes"
import {noteInputType, noteInputTypeWithId} from "../types/noteTypes";
function returnMsg(isValid:SafeParseError<loginType|noteInputTypeWithId>):string{
    var mess:string="";
    const key:string|number = isValid.error.issues[0].path[0];
    if(typeof key==='undefined'){
        mess = isValid.error.issues[0].message;
    }else{
        mess = key+" "+isValid.error.issues[0].message;
    }
    return mess;
}

export {returnMsg}