export const channelToMultiSelectMapper = (
  channels: { id: string; name: string }[]
) => {
  return channels.map((channel) => ({
    value: channel.id,
    text: channel.name,
    selected: false,
  }));
};
