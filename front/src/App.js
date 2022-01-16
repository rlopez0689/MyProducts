import { ChakraProvider } from "@chakra-ui/react";
import Main from "./components/Main";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider>
          <Main />
        </ChakraProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
