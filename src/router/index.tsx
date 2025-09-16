
import Parse from "../view/Parse/Parse.tsx";
import Index from "../view/Index/Index.tsx";


const router = [
    {
        path: '/',
        element: <Index />,
    },
    {
        path: '/parse',
        element: <Parse />,
    }
]

export default router;
