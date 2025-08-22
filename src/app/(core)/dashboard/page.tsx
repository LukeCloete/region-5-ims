"use client";
import { useAuthState } from "react-firebase-hooks/auth";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
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
import getDataForDashboard from "./_lib/data";

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
  const [totalInventory, setTotalInventory] = useState<number | null>(null);
  // const [dailyStockIn, setDailyStockIn] = useState(0);
  // const [dailyStockOut, setDailyStockOut] = useState(0);
  const [totalItemsAdded, setTotalItemsAdded] = useState(0);
  const [totalItemsDispensed, setTotalItemsDispensed] = useState(0);
  const [totalItemsRemaining, setTotalItemsRemaining] = useState(0);
  // const [totalItemsReturned, setTotalItemsReturned] = useState(0);

  if (!user) {
    redirect("/login");
  }

  const handleSave = async () => {
    if (user && displayName) {
      await updateProfile(user, { displayName });
      setIsEditing(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataForDashboard();
      // const totalInventory = data.totalInventory;
      // const dailyStockIn = data.dailyStockIn;
      // const dailyStockOut = data.dailyStockOut;
      // const totalItemsAdded = data.totalItemsAdded;
      // const totalItemsDispensed = data.totalItemsDispensed;
      // const totalItemsRemaining = data.totalItemsRemaining;
      // const totalItemsReturned = data.num2;
      // console.log(data);

      setTotalInventory(totalInventory);
      // setDailyStockIn(dailyStockIn);
      // setDailyStockOut(dailyStockOut);
      setTotalItemsAdded(totalItemsAdded);
      setTotalItemsDispensed(totalItemsDispensed);
      setTotalItemsRemaining(totalItemsRemaining);
      // setTotalItemsReturned(totalItemsReturned);
    };
    fetchData();
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
          <div className="flex flex-wrap gap-4 justify-center items-center mt-4">
            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total inventory Count</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {totalInventory}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card> */}

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items added</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {totalItemsAdded}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card> */}

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items Dispensed</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {totalItemsDispensed}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card> */}

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Items Remaining</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {totalItemsRemaining}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm"></CardFooter>
            </Card> */}

            {/* <Card className="@container/card">
              <CardHeader>
                <CardDescription>Daily Stock IN Count</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                  {dailyStockIn}
                </CardTitle>
              </CardHeader>
              <CardFooter className="flex-col items-start gap-1.5 text-sm">
                <div className="line-clamp-1 flex gap-2 font-medium">
                  Total Stock In count from:
                </div>
                <div className="text-muted-foreground">
                  Today: {formattedToday}
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
        </section>
      )}
    </div>
  );
}
