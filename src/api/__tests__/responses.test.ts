import { describe, expect, test } from "bun:test";
import { err, ok } from "neverthrow";
import {
  errorResponse,
  preflightResponse,
  resultToResponse,
  successResponse,
} from "../helpers/responses";

async function parseBody(response: Response) {
  return response.json();
}

describe("successResponse", () => {
  test("returns 200 status", () => {
    const res = successResponse({ name: "C" });
    expect(res.status).toBe(200);
  });

  test("wraps data in { data } envelope", async () => {
    const res = successResponse({ name: "C", pitch: 0 });
    const body = await parseBody(res);
    expect(body).toEqual({ data: { name: "C", pitch: 0 } });
  });

  test("includes Content-Type header", () => {
    const res = successResponse("hello");
    expect(res.headers.get("Content-Type")).toBe("application/json");
  });

  test("includes CORS headers", () => {
    const res = successResponse("hello");
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, OPTIONS",
    );
    expect(res.headers.get("Access-Control-Allow-Headers")).toBe(
      "Content-Type",
    );
  });
});

describe("errorResponse", () => {
  test("returns the given status code", () => {
    const res = errorResponse("not found", 404);
    expect(res.status).toBe(404);
  });

  test("returns error envelope with message and status", async () => {
    const res = errorResponse("bad request", 400);
    const body = await parseBody(res);
    expect(body).toEqual({ error: { message: "bad request", status: 400 } });
  });

  test("includes CORS headers", () => {
    const res = errorResponse("fail", 500);
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
  });
});

describe("preflightResponse", () => {
  test("returns 204 status", () => {
    const res = preflightResponse();
    expect(res.status).toBe(204);
  });

  test("has no body", async () => {
    const res = preflightResponse();
    expect(res.body).toBeNull();
  });

  test("includes CORS headers", () => {
    const res = preflightResponse();
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Access-Control-Allow-Methods")).toBe(
      "GET, POST, OPTIONS",
    );
  });
});

describe("resultToResponse", () => {
  test("ok result returns success response", async () => {
    const result = ok({ name: "C" });
    const res = resultToResponse(result);
    expect(res.status).toBe(200);
    const body = await parseBody(res);
    expect(body).toEqual({ data: { name: "C" } });
  });

  test("err result returns error response with 400", async () => {
    const result = err(new Error("something went wrong"));
    const res = resultToResponse(result);
    expect(res.status).toBe(400);
    const body = await parseBody(res);
    expect(body).toEqual({
      error: { message: "something went wrong", status: 400 },
    });
  });

  test("applies mapData to ok result", async () => {
    const result = ok({ raw: "value", extra: "stuff" });
    const res = resultToResponse(result, (d) => ({ mapped: d.raw }));
    const body = await parseBody(res);
    expect(body).toEqual({ data: { mapped: "value" } });
  });

  test("mapData is ignored for err result", async () => {
    const result = err(new Error("fail"));
    const res = resultToResponse(result, () => ({ should: "not appear" }));
    expect(res.status).toBe(400);
  });
});
