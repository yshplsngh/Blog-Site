import '../styles/pages/error404.css';
const Error404 = () => {
    return (
        <div className="not-found-container">
            <h1>404 Page Not Found</h1>
            <div className="content">
                <div>
                    <h2>HYDRA has stolen this page from S.H.I.E.L.D. database</h2>
                    {/*<p>*/}
                    {/*    Check that you typed the address correctly, go back to your previous page, or try using our site*/}
                    {/*    search to find something specific.*/}
                    {/*</p>*/}
                </div>
                <div className="error-image-animate"></div>
            </div>
        </div>
    );
};

export default Error404;