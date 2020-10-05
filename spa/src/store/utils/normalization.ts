// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeRelations (data: Record<string, any>, fields: string[]) {
  return {
    ...data,
    ...fields.reduce((prev, field) => ({
      ...prev,
      [field]: Array.isArray(data[field])
        ? data[field].map((x: Record<string, never>) => x.id)
        : data[field]?.id
    }), {})
  }
}

// UNUSED
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function resolveRelations (data: Record<string, any>, fields: string[], rootGetters: Record<string, Function>) {
  return {
    ...data,
    ...fields.reduce((prev, field) => ({
      ...prev,
      [field]: Array.isArray(data[field])
        ? data[field].map((x: number) => rootGetters[`${field}/find`](x))
        : rootGetters[`${field}/find`](data[field])
    }), {})
  }
}
