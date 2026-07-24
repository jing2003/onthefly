import { useEffect, useState } from "react";
import { Link, useRoutes } from "react-router-dom";

import ReadTrips from "./pages/ReadTrips";
import CreateTrip from "./pages/CreateTrip";
import EditTrip from "./pages/EditTrip";
import CreateDestination from "./pages/CreateDestination";
import ReadDestinations from "./pages/ReadDestinations";
import TripDetails from "./pages/TripDetails";
import CreateActivity from "./pages/CreateActivity";
import AddToTrip from "./pages/AddToTrip";
import Login from "./pages/Login";
import AddUserToTrip from "./pages/AddUserToTrip";

import Avatar from "./components/Avatar";

const API_URL = import.meta.env.PROD
  ? "https://onthefly-i4xj.onrender.com"
  : "";

const Header = ({ user, logout }) => {
  return (
    <header className="header">
      <h1>On The Fly ✈️</h1>

      <nav>
        <Link to="/">
          <button type="button" className="headerBtn">
            Explore Trips
          </button>
        </Link>

        <Link to="/destinations">
          <button type="button" className="headerBtn">
            Explore Destinations
          </button>
        </Link>

        <Link to="/trip/new">
          <button type="button" className="headerBtn">
            + Add Trip
          </button>
        </Link>
      </nav>

      <nav className="header-user">
        <Avatar className="avatar" user={user} />

        <span className="header-username">{user.username}</span>

        <button type="button" className="headerBtn" onClick={logout}>
          Logout
        </button>
      </nav>
    </header>
  );
};

const App = () => {
  const [trips, setTrips] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await fetch(`${API_URL}/auth/login/success`, {
          credentials: "include",
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data.user ?? null);
      } catch (error) {
        console.error("Unable to retrieve authenticated user:", error.message);

        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    const fetchAppData = async () => {
      try {
        const [tripsResponse, destinationsResponse] = await Promise.all([
          fetch(`${API_URL}/api/trips`, {
            credentials: "include",
          }),
          fetch(`${API_URL}/api/destinations`, {
            credentials: "include",
          }),
        ]);

        if (!tripsResponse.ok) {
          throw new Error("Unable to fetch trips.");
        }

        if (!destinationsResponse.ok) {
          throw new Error("Unable to fetch destinations.");
        }

        const [tripsData, destinationsData] = await Promise.all([
          tripsResponse.json(),
          destinationsResponse.json(),
        ]);

        setTrips(tripsData);
        setDestinations(destinationsData);
      } catch (error) {
        console.error("Unable to load application data:", error.message);
      }
    };

    getUser();
    fetchAppData();
  }, []);

  const logout = async () => {
    try {
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to log out.");
      }

      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error.message);
    }
  };

  const protectedPage = (page) => {
    if (authLoading) {
      return (
        <main>
          <p>Checking login status...</p>
        </main>
      );
    }

    return user?.id ? page : <Login API_URL={API_URL} />;
  };

  const element = useRoutes([
    {
      path: "/",
      element: protectedPage(<ReadTrips user={user} data={trips} />),
    },
    {
      path: "/trip/new",
      element: protectedPage(<CreateTrip API_URL={API_URL} user={user} />),
    },
    {
      path: "/edit/:id",
      element: protectedPage(
        <EditTrip API_URL={API_URL} user={user} data={trips} />,
      ),
    },
    {
      path: "/destinations",
      element: protectedPage(
        <ReadDestinations user={user} data={destinations} />,
      ),
    },
    {
      path: "/trip/get/:id",
      element: protectedPage(
        <TripDetails API_URL={API_URL} user={user} data={trips} />,
      ),
    },
    {
      path: "/destination/new/:trip_id",
      element: protectedPage(
        <CreateDestination API_URL={API_URL} user={user} />,
      ),
    },
    {
      path: "/activity/create/:trip_id",
      element: protectedPage(<CreateActivity API_URL={API_URL} user={user} />),
    },
    {
      path: "/destinations/add/:destination_id",
      element: protectedPage(<AddToTrip user={user} data={trips} />),
    },
    {
      path: "/users/add/:trip_id",
      element: protectedPage(<AddUserToTrip API_URL={API_URL} user={user} />),
    },
  ]);

  return (
    <div className="App">
      {user?.id && <Header user={user} logout={logout} />}
      {element}
    </div>
  );
};

export default App;
