import { NextResponse } from "next/server";

export function handleSuccessResponse(
  data,
  message = "Request Successful",
  status = 200
) {
  if (data === null) {
    return NextResponse.json(
      {
        success: true,
        message,
      },
      { status }
    );
  } else {
    return NextResponse.json(
      {
        success: true,
        message,
        data,
      },
      { status }
    );
  }
}
export function handleErrorResponse(error, status = 500) {
  return NextResponse.json(
    {
      success: false,
      message: error.message || "An error occurred",
    },
    { status }
  );
}
