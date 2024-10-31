import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
          main: '#FFE4D6',
        },
        secondary: {
          main: '#435585',
        },
      },

    components: {
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#435585',
            },
            '&.Mui-focused': {
                borderColor: '#435585',
                color: '#435585',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#435585',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#435585',
            },
            
          },
        },
      },
      MuiButton: {
        defaultProps: {
          color: 'secondary'
        }
      },
      MuiAlert: {
        styleOverrides: {
          root: {
            backgroundColor: '#FF7777',
            color: '#fff'
          }
        }
      }
    },
  });
  

export default theme;
