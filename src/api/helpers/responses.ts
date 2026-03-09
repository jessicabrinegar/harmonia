import type { Result } from "neverthrow";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function successResponse(data: any) {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export function errorResponse(message: string, status: number) {
  return new Response(JSON.stringify({ error: { message, status } }), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  });
}

export function preflightResponse() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

/**
 * e.g.:
 * resultToResponse(noteResult, (note) => ({
    name: note.name,
    pitch: note.pitch,
  }))
 */
export function resultToResponse(
  result: Result<any, Error>,
  mapData?: (data: any) => any,
) {
  if (result.isOk()) {
    return successResponse(mapData ? mapData(result.value) : result.value);
  } else {
    const error = result.error;
    return errorResponse(error.message, 400);
  }
}
