// export const removeSpecChars = (elem: string) => elem.replace(/[^a-zA-Z .,:;!?#()>-]/g, "").trim();
export const removeSpecChars = (elem) => elem.replace(/[<()^*$]/g, "").trim();
