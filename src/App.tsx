import { observer } from "mobx-react-lite";
import { useContext, useEffect, useRef, useState } from "react";
import { Router, Route, Switch, Redirect, HashRouter, BrowserRouter } from "react-router-dom";
import Login from "./login";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Menu from "./layout/Menu";
import modules from "./modules";
import { RootStoreContext } from "./stores/RootStore";
import Home from "./login/home";
import { createBrowserHistory } from "history";
import PASPeriodeLalu from "./modules/agronomi/features/periodelalu";
import PASHistory from "./modules/agronomi/features/history";
import DetailProblemKebun from "./modules/agronomi/features/detail";
import UbahPassword from "./login/changepassword";
import DetailIOM from "./modules/memo/features/Detail/IOM";
import DetailPengajuan from "./modules/memo/features/Detail/Pengajuan";

export const appHistory = createBrowserHistory();



function App() {
  
  const rootStore = useContext(RootStoreContext);
  const { token } = rootStore.commonStore;
  const [authenticated, isAuthenticated] = useState(false);

  let pageWrapperRef:any;

  useEffect(() => {

    if (token != null) {
      isAuthenticated(true);
    }
    const handleScroll = (e) => {
      console.log(e?.target?.scrollingElement?.scrollTop)
    } 
    // document.addEventListener("scroll",handleScroll,{passive:true})

    // return () => {
    //   document.removeEventListener("scroll", handleScroll)
    // }
    
  }, [])

  return (

    <div>
      {
        authenticated ?
          <>
            <HashRouter>
              {/* <Switch> */}

                <div id="wrapper">
                  <Menu />
                  <div id="page-wrapper" className="gray-bg">
                    <Header />

                    <Route exact path="/" component={Home} />
                    <Route exact path="/agronomi/list/listpasperiodelalu" component={PASPeriodeLalu} />
                    <Route exact path="/agronomi/list/listpashistory" component={PASHistory} />
                    <Route exact path="/agronomi/detail/detailproblemkebun" component={DetailProblemKebun} />

                    <Route exact path="/memo/detail/detailmemo" component={DetailIOM} />
                    <Route exact path="/memo/detail/detailpengajuan" component={DetailPengajuan} />

                    <Route exact path="/changepassword" component={UbahPassword} />

                    {modules.map((module) => (
                      <Route {...module.routeProps} key={module.name} />
                    ))}

                    <Footer />
                  </div>  
                </div>

              {/* </Switch> */}
            </HashRouter>
          </> :
          <>
            <HashRouter>
              {/* <Switch> */}
                <Route exact path="/" component={Login} />
                {/* <Redirect to="/" /> */}
              {/* </Switch> */}
            </HashRouter>

          </>
      }
    </div>
  );

}

export default observer(App);
