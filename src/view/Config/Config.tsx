interface ConfigProps {
    style?: { display: string }
}

function Config({style}: ConfigProps) {
    return (
        <>
            <div style={style}></div>
        </>
    )
}


export default Config
