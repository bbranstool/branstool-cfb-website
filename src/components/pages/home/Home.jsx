import "./Home.css";

function Home() {
    return (
        <div className="home">
            <section className="hero-section">
                <h1 className="hero-title">Welcome To My CFB Website</h1>
                <p className="hero-subtitle">
                    This site has fun and unique college football stats. Almost all of these stats are completely
                    useless and just for the love of the game so please enjoy them as such.
                </p>
            </section>

            {/* Example section for future use */}
            <section className="content-section">
                <h2>Latest Features</h2>
                <p>
                    This is a test
                </p>
            </section>
        </div>
    );
}
export default Home
