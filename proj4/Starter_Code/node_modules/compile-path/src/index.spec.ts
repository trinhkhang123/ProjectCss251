import { compilePath } from "./index";

const BASE_ROUTE = "/base-route";

describe("compile-path", () => {
  it("should create simple route", () => {
    expect(compilePath(BASE_ROUTE)).toEqual("/base-route");
  });

  it("should create route with params", () => {
    const params = { id: 10 };

    expect(compilePath(`${BASE_ROUTE}/:id`, params)).toEqual("/base-route/10");
  });

  it("should create route with params & query", () => {
    const params = { id: 10 };
    const query = { name: "Codibly" };

    expect(compilePath(`${BASE_ROUTE}/:id`, params, query)).toEqual(
      "/base-route/10?name=Codibly"
    );
  });

  it("should create route with undefined params and query", () => {
    expect(compilePath(BASE_ROUTE, undefined, undefined)).toEqual(
      "/base-route"
    );
  });

  it("should create route with undefined params and simple query", () => {
    const query = { name: "Codibly" };

    expect(compilePath(BASE_ROUTE, undefined, query)).toEqual(
      "/base-route?name=Codibly"
    );
  });
});
