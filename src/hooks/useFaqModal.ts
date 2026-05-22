import { useDisclosure } from "@mantine/hooks";

export function useFaqModal() {
  const [opened, { open, close }] = useDisclosure(false);
  return { opened, open, close };
}
