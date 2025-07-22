export const getLatestRegionData = (dataset, regionName) => {
    return [...dataset]
      .reverse()
      .find((row) => row.Région === regionName || row.Region === regionName);
  };
  