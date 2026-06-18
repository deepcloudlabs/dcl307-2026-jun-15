import {Suspense} from "react";

import LikeButton from "./LikeButton.jsx";
import UserProfile from "./UserProfile.jsx";
import {getUserService} from "./service.js";

const USER_ID = "123456789";

const testItems = ["Test 1", "Test 2", "Test 3"];

function ErrorBoundary({children}) {
    try {
        return children;
    } catch (e) {
        return <p>Something went wrong: {e}</p>;
    }
}

export default function App() {
    const userPromise = getUserService(USER_ID);
    return (
        <main>
            <ErrorBoundary fallback={<p>Could not load user profile.</p>}>
                <Suspense fallback={<UserProfileFallback/>}>
                    <UserProfile userPromise={userPromise}/>
                </Suspense>
            </ErrorBoundary>
            <TestList items={testItems}/>

            <LikeButton/>
        </main>
    );
}

function UserProfileFallback() {
    return <p>Loading user profile...</p>;
}

function TestList({items}) {
    return (
        <ul>
            {items.map((item) => (
                <li key={item}>{item}</li>
            ))}
        </ul>
    );
}