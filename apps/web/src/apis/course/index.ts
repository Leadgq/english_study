import type { CourseList } from "@en/common/course/index.ts";
import { serverApi } from "../index";
import type { Response } from "../index.ts";


 
export const getCourseList = () => {
    return serverApi.get("/course/list") as Promise<
        Response<CourseList>
    >;
}