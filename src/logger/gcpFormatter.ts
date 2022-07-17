import { format, TransformableInfo } from "logform";
import { flatten } from "./flatten";

function serializeError(error: Error) {
  return {
    name: "Error",
    message: error.message,
    stack: error.stack,
  };
}
function gcpLogTransformer(info: TransformableInfo): TransformableInfo {
  const { message, level, labels, ...meta } = info;

  const data = Object.entries(meta).reduce((acc, [key, value]) => {
    if (value instanceof Error) {
      return {
        ...acc,
        [key]: serializeError(value),
      };
    }

    return {
      ...acc,
      [key]: value,
    };
  }, {});

  return {
    level,
    message,
    data,
    "logging.googleapis.com/labels": {
      ...flatten(labels),
    },
  };
}

export const gcpFormatter = format(gcpLogTransformer);
