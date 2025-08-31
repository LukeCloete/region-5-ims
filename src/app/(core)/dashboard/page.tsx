"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { useEffect, useState, useReducer } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import {
  Card,
  // CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDataForDashboard, getDataForReport } from "./_lib/data";

export default function Page() {
  // function getFormattedDate(date: Date): string {
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed (0 for January, 11 for December)
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // }
  // const today: Date = new Date();
  // const formattedToday: string = getFormattedDate(today);

  const [user] = useAuthState(auth);
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [isEditing, setIsEditing] = useState(!user?.displayName);

  const handleDownload = async () => {
    // Call the server action to get the file buffer
    const buffer = await getDataForReport();

    // Create a Blob from the received buffer
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a temporary link element and trigger the download
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-data.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object to free up memory
    URL.revokeObjectURL(url);
  };

  if (!user) {
    redirect("/login");
  }

  const handleSave = async () => {
    if (user && displayName) {
      await updateProfile(user, { displayName });
      setIsEditing(false);
    }
  };

  type FormState = {
    totalInventory: number;
    dailyStockIn: number;
    dailyStockOut: number;
    totalItemsAdded: number;
    totalItemsDispensed: number;
    totalItemsRemaining: number;
    totalItemsReturns: number;
  };

  type FormAction =
    | {
        type: "SET_FIELD";
        field: 5 | 10;
        payload: number;
      }
    | {
        type: "SET_INITIAL_VALUES";
        payload: {
          totalInventory: number;
          dailyStockIn: number;
          dailyStockOut: number;
          totalItemsAdded: number;
          totalItemsDispensed: number;
          totalItemsRemaining: number;
          totalItemsReturns: number;
        };
      }; // New action type for initial load;

  function formReducer(state: FormState, action: FormAction): FormState {
    switch (action.type) {
      case "SET_FIELD": {
        const newState = {
          ...state,
          [action.field]: action.payload,
        };

        return {
          ...newState,
        };
      }
      case "SET_INITIAL_VALUES": {
        return {
          ...state, // Keep any other existing state properties if you had them
          totalInventory: action.payload.totalInventory,
          dailyStockIn: action.payload.dailyStockIn,
          dailyStockOut: action.payload.dailyStockOut,
          totalItemsAdded: action.payload.totalItemsAdded,
          totalItemsDispensed: action.payload.totalItemsDispensed,
          totalItemsRemaining: action.payload.totalItemsRemaining,
          totalItemsReturns: action.payload.totalItemsReturns,
        };
      }
      default:
        return state;
    }
  }
  const initialState: FormState = {
    totalInventory: 0,
    dailyStockIn: 0,
    dailyStockOut: 0,
    totalItemsAdded: 0,
    totalItemsDispensed: 0,
    totalItemsRemaining: 0,
    totalItemsReturns: 0,
  };

  const [state, dispatch] = useReducer(formReducer, initialState);

  useEffect(() => {
    async function fetchMetrics() {
      const metricsData = await getDataForDashboard();

      // If metricsData is an array, use the first item or aggregate as needed
      const metrics = Array.isArray(metricsData) ? metricsData[0] : metricsData;

      dispatch({
        type: "SET_INITIAL_VALUES",
        payload: {
          totalInventory: metrics?.totalInventory ?? 0,
          dailyStockIn: metrics?.dailyStockIn ?? 0,
          dailyStockOut: metrics?.dailyStockOut ?? 0,
          totalItemsAdded: metrics?.totalItemsAdded ?? 0,
          totalItemsDispensed: metrics?.totalItemsDispensed ?? 0,
          totalItemsRemaining: metrics?.totalItemsRemaining ?? 0,
          totalItemsReturns: metrics?.totalItemsReturns ?? 0,
        },
      });
    }
    fetchMetrics();
  }, []);

  return (
    <div>
      {isEditing ? (
        <div>
          <h1 className="text-2xl font-bold mb-2">Set your display name</h1>
          <input
            className="border px-2 py-1 rounded mr-2"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter display name"
          />
          <button
            className="bg-blue-500 text-white px-4 py-1 rounded"
            onClick={handleSave}
            disabled={!displayName}
          >
            Save
          </button>
        </div>
      ) : (
        <section>
          <div className="text-left flex justify-center align-center">
            <h1 className="text-3xl text-primary-foreground font-bold text-white ">
              Welcome, {user.displayName}
            </h1>
          </div>
          {/* First row of cards */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-8">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total inventory Count</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl ">
                  {state.totalInventory}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items added</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {state.totalItemsAdded}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items Dispensed</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {state.totalItemsDispensed}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card>

            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items Remaining</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {state.totalItemsRemaining}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card>

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Daily Stock IN Count</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  0
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Total Stock In count from:
                </div>
                <div className="text-muted-foreground">
                  0 Today: {formattedToday}
                </div>
              </CardFooter>
            </Card> */}

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Daily Stock OUT Count</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {dailyStockOut}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Total Stock Out count from:
                </div>
                <div className="text-muted-foreground">
                  Today: {formattedToday}
                </div>
              </CardFooter>
            </Card> */}
          </div>

          {/* Second row of cards */}
          <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items Returned</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {totalItemsReturned}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card> */}
          </div>
          <div>
            <p>This is to test the report generation feature</p>
            <button onClick={handleDownload}>
              This button is to generate a report
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
