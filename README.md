# bridge-server
connections to third-party data

## Structure

| Path | Description |
| --- | --- |
| /modules | A module is a bridge connector to a specific data profider, like gmaps or sportsdata |
| /processors | The processors perform specific tasks to bridge the data source into Metric Data |

Processors usually require METRIC_KEY be defined in an environment variable
