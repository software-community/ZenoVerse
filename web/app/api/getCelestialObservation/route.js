import connectMongoDB from "@/database/mongo";
import Celestial_Observation from "@/models/Celestial_Observation";
import { NextResponse } from "next/server";

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connectMongoDB();

    // Get the celestial body name from query parameters
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json(
        { error: "Celestial body name is required" },
        { status: 400 }
      );
    }

    // Query the database for observations matching the name
    const observations = await Celestial_Observation.find({
      name: { $regex: name, $options: 'i' } // Case-insensitive search
    });
    // Return the observations
    return NextResponse.json(
      { 
        success: true,
        count: observations.length,
        data: observations 
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error fetching celestial observations:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch celestial observations",
        details: error.message 
      },
      { status: 500 }
    );
  }
}
