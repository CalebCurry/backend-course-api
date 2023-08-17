// const getData = () => {
//     return new Promise((resolve, reject) => {
//         let i;
//         for (i = 0; i < 10000000000; i++) {}

//         resolve(i);
//     });
// };

// console.log(1);

// getData()
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });

// console.log(2);

fetch('https://google.com')
    .then((response) => {
        return response.text();
    })
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err.message);
    });
