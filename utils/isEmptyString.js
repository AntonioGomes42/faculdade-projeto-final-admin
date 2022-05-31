export default function isEmptyString(value, errorMessage) {
    if (value == "" || (typeof value === 'string' && value.trim().length === 0) ) {
        throw new Error(errorMessage); 
    }
    return false;
}