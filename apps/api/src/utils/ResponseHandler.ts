function returnMsg(isValid: any): string {
  let mess: string;
  const key: string | number = isValid.error.issues[0].path[0];
  if (typeof key === "undefined") {
    mess = isValid.error.issues[0].message;
  } else {
    mess = key + " " + isValid.error.issues[0].message;
  }
  return mess;
}

export { returnMsg };
