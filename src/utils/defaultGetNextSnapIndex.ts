export const defaultGetNextSnapIndex = (
  snapPoints: number[],
  height: number,
  velocityY: number
) => {
  const target = height + velocityY / 10
  return snapPoints.indexOf(
    snapPoints.reduce((prev, curr) =>
      Math.abs(curr - target) < Math.abs(prev - target) ? curr : prev
    )
  )
}
