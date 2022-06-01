export default function isEmptyString(value) {
    if (value == "" || (typeof value === 'string' && value.trim().length === 0) ) {
        return true; 
    }
    return false;
}