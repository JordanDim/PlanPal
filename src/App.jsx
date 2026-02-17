import { useContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./views/Home.jsx";
import Dashboard from "./views/Dashboard.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import NotFound from "./views/NotFound.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import { AppProvider, AppContext } from "./context/AppContext.jsx";
import LoadingSpinner from "./components/Loading/LoadingSpinner";
import Profile from "./components/Profile/Profile.jsx";
import withLoading from "./hoc/PageLoading.jsx";
import CreateEventForm from "./components/Events/CreateEventForm.jsx";
import AllEvents from "./components/Events/AllEvents.jsx";
import ContactsDashboard from "./components/Contacts/ContactsDashboard.jsx";
import MyEvents from "./components/Events/MyEvents.jsx";
import PublicEvents from "./components/Events/PublicEvents.jsx";
import PrivateEvents from "./components/Events/PrivateEvents.jsx";
import SingleViewEvent from "./components/Events/SingleEventView.jsx";
import UpdateEvent from "./components/Events/UpdateEvent.jsx";
import Calendar from "./components/Calendar/Calendar.jsx";
import { ToastContainer } from "react-toastify";
import AboutUs from "./views/AboutUs.jsx";
import UserSearch from "./components/AdminPanel/UserSearch.jsx";
import Blocked from "./views/Blocked.jsx";
import Authenticated from "./hoc/Authenticated"; // Import the Authenticated component
import { BASE } from "./common/constants.js";

const HomeWithLoading = withLoading(Home);
const LoginWithLoading = withLoading(Login);
const RegisterWithLoading = withLoading(Register);
const ContactsDashboardWithLoading = withLoading(ContactsDashboard);
const ProfileWithLoading = withLoading(Profile);
const NotFoundWithLoading = withLoading(NotFound);
const DashboardWithLoading = withLoading(Dashboard);
const AboutUsWithLoading = withLoading(AboutUs);
const CalendarWithLoading = withLoading(Calendar);
const CreateEventWithLoading = withLoading(CreateEventForm);
const AllEventsWithLoading = withLoading(AllEvents);
const MyEventsWithLoading = withLoading(MyEvents);
const PublicEventsWithLoading = withLoading(PublicEvents);
const PrivateEventsWithLoading = withLoading(PrivateEvents);
const SingleViewEventWithLoading = withLoading(SingleViewEvent);

function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <ToastContainer newestOnTop />
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const { user, userData, loading } = useContext(AppContext);

  const renderDashboard = () => {
    return <DashboardWithLoading />;
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col min-h-screen max-w-full">
      <Header />
      <div className="container mx-auto flex-grow min-w-min">
        <Routes>
          <Route
            path={`${BASE}`}
            element={
              user ? (
                userData && userData.isBlocked ? (
                  <Blocked />
                ) : (
                  renderDashboard()
                )
              ) : (
                <HomeWithLoading />
              )
            }
          />
              <Route path={`${BASE}login`} element={<LoginWithLoading />} />
              <Route
                path={`${BASE}register`}
                element={<RegisterWithLoading />}
              />
              <Route
                path={`${BASE}contacts`}
                element={
                  <Authenticated>
                    <ContactsDashboardWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}dashboard`}
                element={
                  <Authenticated>
                    <DashboardWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}create-event`}
                element={
                  <Authenticated>
                    <CreateEventWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}calendar`}
                element={
                  <Authenticated>
                    <CalendarWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}update-event/:eventId`}
                element={
                  <Authenticated>
                    <UpdateEvent />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}events`}
                element={
                  <Authenticated>
                    <AllEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}my-events`}
                element={
                  <Authenticated>
                    <MyEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}public-events`}
                element={
                  <Authenticated>
                    <PublicEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}private-events`}
                element={
                  <Authenticated>
                    <PrivateEventsWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}events/:eventId`}
                element={
                  <Authenticated>
                    <SingleViewEventWithLoading />
                  </Authenticated>
                }
              />
              <Route
                path={`${BASE}profile/:handle`}
                element={
                  <Authenticated>
                    <ProfileWithLoading />
                  </Authenticated>
                }
              />
              <Route path={`${BASE}about`} element={<AboutUsWithLoading />} />
              <Route path={`${BASE}user-search`} element={<UserSearch />} />
              <Route path={`${BASE}blocked`} element={<Blocked />} />
              <Route path="*" element={<NotFoundWithLoading />} />
            </Routes>
          </div>
          <Footer />
        </div>
  );
}

export default App;
