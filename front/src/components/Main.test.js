import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Main from "./Main";
import { rest } from "msw";
import { setupServer } from "msw/node";
import { QueryClient, QueryClientProvider } from "react-query";
const queryClient = new QueryClient();

const server = setupServer(
  rest.get("http://localhost:7070/api/product/", (req, res, ctx) => {
    return res(
      ctx.json([{ name: "my chair", description: "my desc", price: 23 }])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("loads and displays initial products", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );

  expect(screen.getByText("My Products")).toBeInTheDocument();
  expect(screen.getByText("Add new Product")).toBeInTheDocument();
});

test("Create new product show modal", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );

  fireEvent.click(screen.getByText("Add new Product"));

  expect(screen.getByRole("dialog")).toHaveTextContent("Add new product");
});

test("Shows product cards", async () => {
  render(
    <QueryClientProvider client={queryClient}>
      <Main />
    </QueryClientProvider>
  );
  await waitFor(() => expect(screen.getByText("my chair")));
});
