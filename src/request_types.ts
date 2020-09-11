export enum Requests {
  isEnabled = "req_isenabled",
}
export type IsExtEnabled = {
  type: Requests.isEnabled;
  payload: boolean;
};
