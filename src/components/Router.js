import react, { useState } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Auth from "../routes/Auth";
import Home from "../routes/Home";

const AppRouter = () => {
  // hooks
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // auth 여부에 따라 렌더링
  return (
    <Router>
      <Switch>
        {isLoggedIn ? (
          // <> : fragment. 많은 요소 렌더시 사용
          <>
            <Route exact path="/">
              <Home />
            </Route>
          </>
        ) : (
            <Route excat path="/">
              <Auth />
            </Route>
        )}
      </Switch>
    </Router>
  )
}

export default AppRouter;