const Home = () => {
    return (
        <>
            <section>
                <div className="Home container">
                    <div className="row card">
                        <h2>
                            Welcome to our cultural events website!
                        </h2>
                        <p>
                            Feel free to checkout our latest cultural events in different locations in Hong Kong.<br></br>
                            We offer a fully functional map and table for you to explore the events.<br></br>
                            You could also bookmark your favorite locations and events!<br></br>
                            Explore more about our cultural programmes now!<br></br>
                        </p>

                        <p>
                            <i>source: LCSD Cultural Programmes</i>
                            <br />
                            <sub style={{ color: "grey" }}>Last updated time: {window.sessionStorage.getItem("LastUpdate")}</sub>
                        </p>
                    </div>
                </div>
            </section >
        </>
    );
};

export default Home;