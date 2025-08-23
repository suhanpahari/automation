import React from 'react';

const LandingPage = () => {
    return (
        <div className="landing-page">
            <header>
                <h1>Welcome to Our Chat Application</h1>
                <p>Please log in to continue</p>
            </header>
            <main>
                <button onClick={() => {/* Handle Google OAuth login */}}>
                    Login with Google
                </button>
            </main>
        </div>
    );
};

export default LandingPage;