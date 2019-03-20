function sleep(second) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            reject('want to sleep~');
        }, second);
    })
}

async function errorDemoSuper() {
    try {
        let result = await sleep(1000);
        console.log(1);
    } catch (err) {
        console.log(err);
    }
}
errorDemoSuper();
