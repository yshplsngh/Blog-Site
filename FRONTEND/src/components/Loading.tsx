import HashLoader from 'react-spinners/HashLoader';
interface stypeTypo{
    [key:string]:string
}
const Loading= () => {
    const loadingStyle:stypeTypo = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex:'999',
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        // background: 'rgb(111,111,111,0.2)', // Here you choose the color and opacity that you want to apply
    };

    return (
        <div style={loadingStyle}>
            <HashLoader color="#008000" size={100} speedMultiplier={1} />
        </div>
    );
};

export default Loading;
