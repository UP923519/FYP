import React, { useEffect } from "react";
import Navbar from '../Navbar/Navbar.js';
import Login, {} from '../Login/Login';
import useToken from './useToken';

export const theUser = localStorage.getItem('username');


if (localStorage.getItem("fontSize") == null){
  localStorage.setItem("fontSize", 16);
}

let backGroundColour = "#edf8ff";


if (localStorage.getItem("darkMode") == "#a6a6a6"){
  console.log("darkModeActive");
  backGroundColour = "#c1ecf0";
}


<style name="MyTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowLightStatusBar">true</item>
    <item name="android:statusBarColor">@android:color/white</item>
</style>




function App() {
  const { token, setToken, removeToken, getToken} = useToken();
  const greeting = "greeting";
  const displayAction = false;

  useEffect(() => {
    document.body.style.backgroundColor = (localStorage.getItem("darkMode"));
  }, []);

  if(!token) {
    return <Login setToken={setToken} />
  }

  return (   
    <div className="wrapper" style = {{fontSize: Number(localStorage.getItem("fontSize")), backgroundColor: localStorage.getItem("darkMode")}}>
      <h1 className = "titleClass" style = {{color: "#2d9ba1", backgroundColor:backGroundColour, borderRadius:"20px"}} >Carbon Tracker</h1>
      <div className = "topBanner1">
        <h4> Welcome, {localStorage.getItem('username')}
        {displayAction && <p>I am writing JSX</p>}
        <button id="showHide" style={{fontSize:"medium"}}className = "logOut" onClick={removeToken}>
          ￩ Log Out
        </button> </h4>
      </div>
      <div>
        <Navbar />
      </div>

    </div>
  );
}

export default App;


