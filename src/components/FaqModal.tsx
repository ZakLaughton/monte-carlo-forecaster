import { Modal, Text } from "@mantine/core";

type Props = {
  opened: boolean;
  onClose: () => void;
};

export function FaqModal({ opened, onClose }: Props) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Frequently Asked Questions"
      size="lg"
      centered
    >
      <Text c="dimmed">FAQ content coming soon.</Text>
    </Modal>
  );
}
