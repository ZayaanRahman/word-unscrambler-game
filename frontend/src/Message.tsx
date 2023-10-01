// trying out components
function Message() {

    const name = 'test';

    if (name === 'test') {
        return <h1>Hello, {name}!</h1>;
    } else {
        return <h1>Goodbye, {name}!</h1>;
    }
}

export default Message;