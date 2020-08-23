import {setDocId} from "../lib";

test("Set Docid Test", ()=>{
  expect(setDocId("a", "b")).toBe("a");
  expect(setDocId(null, "a")).toBe("a");
  expect(setDocId("a", null)).toBe("a");
  expect(setDocId(null, null)).toBe(null);
  expect(setDocId(undefined, undefined)).toBe(null);
});