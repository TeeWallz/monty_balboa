
const commonStyle = theme => ({
        section: {
            // background-color: var(--section-bg-color);
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '8px',
            marginRight: '8px',
            padding: '8px',
            boxShadow: '2px 2px 2px 2px rgba(170, 170, 170, 0.67)',
            marginBottom: '8px',
            backgroundColor: '#FFF',

            [theme.breakpoints.up('xs')]: {
                marginLeft: '10px',
                marginRight: '10px',
            },
            [theme.breakpoints.up('md')]: {
                'marginLeft': 'auto',
                'marginRight': 'auto',
                width: '800px',
            },
        }
});
export default commonStyle;

// function applyCommonTheme(themeObject, otherTheme){
//     return Object.assign({}, otherTheme, commonTheme(themeObject));
// }
//
// export default applyCommonTheme