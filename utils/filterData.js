export default function filterData(data) {
    return new Promise((res) => {
        const dataFiltered = [];
        data.forEach((doc) => (dataFiltered.push({ id: doc.id, ...doc.data() })));
        res(dataFiltered);
    });
}