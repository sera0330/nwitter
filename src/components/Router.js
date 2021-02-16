import React from "react";
import { HashRouter as Router, Route, Switch, Redirect } from "react-router-dom";
import Auth from "routes/Auth";
import Home from "routes/Home";
import Profile from "routes/Profile";
import Navigation from "components/Navigation";

const AppRouter = ( { isLoggedIn, userObj, refreshUser }) => {
  // auth 여부에 따라 렌더링
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Switch>
        {isLoggedIn ? (
          // <> : fragment. 많은 요소 렌더시 사용
          <div className="router">
            <Route exact path="/">
              <Home userObj={userObj} />
            </Route>
            <Route exact path="/profile">
              <Profile userObj={userObj} refreshUser={refreshUser} />
            </Route>
            <Redirect from="*" to="/" />
          </div>
        ) : (
          <>
            <Route excat path="/">
              <Auth />
            </Route>
            <Redirect from="*" to="/" />
          </>
        )}
      </Switch>
    </Router>
  )
}

export default AppRouter;