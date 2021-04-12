export const generateCodeNumeric = (length: number): string => {
    return [...Array(length)].map(()=>generateSigleCode()).join("");
};
const generateSigleCode = ():number => Math.floor(Math.random() * 10);
