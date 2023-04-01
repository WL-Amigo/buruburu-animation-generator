/* Fast pairwise nearest neighbor based algorithm for multilevel thresholding
Copyright (C) 2004-2019 Mark Tyler and Dmitry Groshev
Copyright (c) 2018-2022 Miller Cy Chan
* error measure; time used is proportional to number of bins squared - WJ */

// this script is modified version from https://github.com/mcychan/PnnQuant.js
// * var -> let
// * syntax error collection
// * add support for ES Modules

const RAW_BLUE_NOISE = [
  -63, 119, 75, 49, -74, 21, -32, 7, -6, -66, -19, 78, -101, 89, 24, -25, 122, -50, -6, 100, -125, -45, 105, 32, -83,
  114, -20, -88, -3, -35, 73, -93, 103, 59, 126, 79, 19, -115, -41, 6, 118, 69, 49, 96, -69, -36, 4, 41, -79, 55, 12,
  -125, -70, 37, -101, 76, -116, -45, 68, -124, 31, 55, -36, 69, 42, 12, -104, -1, -19, 127, -93, 82, -49, 65, 50, 13,
  40, -117, -59, 2, 54, -101, 19, -81, 63, 42, -62, -115, 59, -52, -128, 69, 33, -62, 18, 44, -24, 6, -70, -31, 54, 104,
  34, -13, -94, -55, -126, 110, 34, 60, -122, 115, 90, -97, -59, 65, 116, -41, 18, 2, 120, 44, 97, -24, 107, -107, 90,
  -11, 108, -79, -41, 27, 100, -59, -113, 38, 107, -104, -80, -42, -9, 110, 67, -38, -122, 93, 37, -23, -108, 127, -8,
  18, 83, 1, -40, 108, -107, -76, 117, -111, -55, 30, -104, -121, -2, -85, -64, 62, 90, -33, 0, -105, 79, -82, -15, 17,
  -43, -26, 101, -9, -88, -22, 94, -62, -79, 24, -97, -2, -82, 17, -71, -118, 63, -24, 85, -125, -86, 69, 54, -24, 19,
  -127, 95, 124, -68, -94, 33, -83, 116, -67, 80, 5, -39, 71, -91, -72, 117, -99, 46, 24, -14, 62, 84, -1, 51, 110, 88,
  67, 118, -19, -102, 112, 42, -77, 27, -20, -47, 121, -100, 67, -68, 47, 25, -109, 80, 49, -113, 59, -14, 83, -35, -56,
  50, 75, -46, 34, -100, -56, 51, 114, 32, -45, -8, -73, 86, 0, 28, -28, 52, 8, 86, -22, 16, -11, -98, 103, -57, 27, 49,
  -22, -34, 96, -81, -59, 101, -29, -45, -124, -83, -14, -41, 13, -56, 28, 75, -49, 11, -115, 104, 53, 9, -61, 31, 84,
  -118, 2, 126, -51, -76, 32, 107, -48, -123, 113, 64, -110, 126, -17, 99, 3, 120, 19, -13, -69, 5, 79, -102, 120, -37,
  -61, -97, 74, -115, -50, 101, -112, 73, -46, 55, -76, 112, -110, 93, -121, 11, 35, 74, -116, 6, 32, 36, 96, 70, -65,
  -95, 42, -77, 96, -27, -109, -12, 83, -67, 70, -92, 98, -7, -35, 108, -90, 72, -31, 13, -5, -95, -26, 11, 37, -70, 5,
  29, -124, -32, -87, 71, -115, 91, -30, -112, 99, 16, -89, 61, 44, 109, -15, -75, 61, -2, -61, 45, 28, -124, -27, 13,
  -14, 77, -65, 63, -49, -10, 113, 57, -71, 15, 120, -26, 26, 101, -7, -128, 50, -90, 22, 58, 126, -39, -124, -27, 45,
  -111, 58, -74, -16, 39, -128, 87, 119, -65, 75, 99, -86, -43, 92, -94, 79, -64, 45, -48, -77, 58, -91, 43, -55, -18,
  33, -119, 92, -47, 12, 36, 113, -103, -33, 125, -90, 87, 66, 42, -85, -43, -3, 122, -107, -88, 21, -20, 80, -52, -107,
  2, -116, 55, 124, -34, 82, 113, 1, -60, -84, 37, -1, 114, -81, 24, -46, 14, 95, -57, -100, 51, -42, 61, 22, -104, 48,
  -6, -24, 56, 13, 111, -8, 97, 7, -39, 125, -3, 65, 115, -68, -31, -5, -84, -123, 84, -24, 20, -78, 95, 7, -8, -54,
  120, -99, 101, 30, -75, 49, 86, -40, -123, 40, -86, 64, -38, 85, -54, -100, 7, -69, -45, -119, 97, -18, -101, 17, 87,
  -58, 77, 123, -106, 66, 27, 115, 5, -82, -120, -13, -55, 121, -114, 105, -51, -81, -105, 26, -22, 37, 77, -126, 24,
  -79, -104, 78, 104, 22, 55, 123, -62, -94, 75, 57, -108, -42, -71, -118, 22, -32, 58, -125, 9, 106, -26, -65, 126, 93,
  -9, 104, 46, -75, 20, 74, 34, -13, 67, 45, 26, 75, 107, -49, 61, -14, -122, 3, -23, -85, -37, -10, -69, 98, 34, -33,
  85, 8, -73, 66, 35, -34, 84, -118, 112, -100, -64, 104, -24, -44, 50, 9, -54, -111, 70, -39, 3, 43, -51, -15, 32, 108,
  71, 97, 0, -63, 81, -20, -53, -94, 27, 68, 4, -99, 29, -61, -16, -92, 112, -23, -109, -82, 92, 32, -35, -75, -118, 50,
  -70, -95, 98, 41, -65, 54, 107, 78, -110, -21, 70, 108, -89, 29, 77, -127, -1, 124, 49, -56, 63, -6, -86, 15, 71,
  -116, 90, -9, -93, -20, -74, 31, -105, 112, 91, -128, 15, -28, 49, -92, 38, 115, -113, 45, 96, -5, -109, 55, -79, -46,
  -113, 116, 13, -125, 89, -47, 57, 122, 14, -55, -22, 118, -4, 9, -29, 28, 112, -42, 74, -118, 7, -93, 42, 15, -59, 54,
  -101, -41, -19, -62, 19, -98, -13, -75, 22, 46, 93, -52, 36, 113, -71, 28, 120, 45, 98, 86, -29, -8, -68, -85, 119,
  -61, -112, -18, -77, 16, -39, 72, -72, 118, -34, 80, 18, -23, 51, 77, -34, 62, 0, -63, 42, -121, -6, 101, -106, 65,
  34, 90, -113, 68, -82, -5, -99, 31, -55, 89, -44, 127, -115, -75, 2, 116, 46, 102, -85, 92, 74, -42, 117, -106, -35,
  3, -95, -14, -33, 62, -126, -44, 12, -88, -119, 18, 51, 66, 2, 82, -48, 63, 91, -103, -9, -87, 11, 35, -117, -58, 111,
  91, -4, -71, 34, -84, 100, 24, -31, -72, 81, 28, 52, -62, -86, -43, 125, -57, 15, -25, 96, 120, -15, 50, -84, -4, 96,
  -24, 22, 88, -105, -47, 57, -27, 9, -122, -17, 82, -76, 101, 52, -111, 85, -83, 3, 108, -65, 60, 78, -47, 104, -35,
  -100, 35, -7, 125, 24, -58, 109, 59, -48, 87, -12, -85, 41, -122, -94, -51, 125, -116, -15, -99, 111, 71, -90, -45, 3,
  -125, 104, -16, -101, 39, 86, -127, 60, -75, -32, 20, -124, 68, 33, -53, 61, -121, -9, -70, 31, -111, 106, -61, 57,
  30, -117, 65, -63, 119, 16, -56, 76, -102, -6, -23, 127, 30, -76, -116, 95, 13, -88, -122, -36, 79, 44, -127, -97,
  -26, 124, 14, 63, -37, 106, 69, 7, 54, -41, 83, 10, -112, -12, 120, -30, 84, 18, 73, 54, -69, 3, -46, 25, -111, 79,
  113, -65, -37, 110, 32, 77, -32, 16, 122, 70, -2, 41, -89, 126, -30, 11, -7, -42, 42, -21, 32, -36, 55, 40, -113, -58,
  -95, -11, 46, -22, -66, 105, 55, -73, 4, -21, 30, 102, 70, -69, -105, 0, -64, -17, 23, -107, 94, -75, 38, -54, 49, 63,
  -66, -98, 44, -76, -7, -36, 110, -90, 118, 43, -59, -94, 0, 56, -105, -11, -79, 40, -61, 94, -94, -40, -77, 86, -50,
  -99, -71, 78, 105, -88, -107, 93, -121, 122, -74, 100, 24, 70, 5, 87, 117, -53, 76, 41, -27, -106, 116, -84, -62, -4,
  -40, 52, 98, 29, 84, 47, -81, -26, -60, -1, 118, -22, -82, 98, 30, 8, 114, -51, -119, 27, -109, -23, 70, -10, 97, 14,
  -23, 101, 25, 87, 10, 118, -111, 2, 48, 101, -125, -12, 20, 1, 45, -122, -53, 25, 71, -69, -11, -94, 10, -48, -85,
  114, -41, -108, 58, 21, -119, 0, -47, 92, 66, 12, 85, -112, 20, -79, -120, -47, 32, 121, -128, 103, 77, 27, -101,
  -124, 19, -40, -116, -19, 91, -87, 58, 100, 80, 10, -79, -107, 62, -43, 39, -114, -72, -48, -27, 59, -86, -17, -54,
  28, -25, 112, 67, -38, 97, -17, 116, 50, -1, 110, 62, 82, -28, 90, -126, -16, 37, -72, -30, -93, -80, 121, 28, -14,
  -94, 49, -50, 122, 38, -18, 113, -29, 71, -5, 15, -40, 44, -89, 66, 89, -3, 127, 76, -104, 66, -32, 0, -67, 36, -51,
  106, -31, -69, 84, -86, 115, 73, 47, -128, 102, 22, 82, 64, -103, -67, 52, -112, -59, -93, 16, -78, -29, -100, -40,
  -58, 23, 45, -3, -63, 53, 12, 72, 104, -9, 86, 63, -110, -60, 108, -121, -31, 72, -89, 91, 56, 10, -73, -56, 59, -112,
  -13, -49, 108, -29, -62, 53, -49, -71, 38, 20, 123, -97, -14, -121, 48, 21, 125, -119, 5, -57, -14, -97, -2, -64, -40,
  -116, 119, 14, 92, -83, 80, 121, 30, 61, 88, -113, 9, 36, -81, -118, -106, 65, 107, -97, 94, -114, -58, 35, 14, -68,
  -37, 40, 18, -7, -71, 5, -109, -63, -9, -115, 102, 33, 85, 113, -70, 9, 49, -77, 32, -95, 6, 112, -10, -127, -57, 88,
  -38, 61, 93, 32, -7, 34, 56, -34, 98, 29, 124, 76, 38, -75, -30, -6, -46, 36, 6, -10, -128, -46, -65, 74, 125, 57,
  100, -19, 118, -37, 18, -80, -25, 0, -44, 114, -127, -20, 99, 73, -83, 88, 59, 110, 26, -38, 79, 46, -84, -103, -33,
  -92, 25, 95, -122, -9, 82, -112, 94, -36, 47, -78, 69, 11, 115, -83, 3, -58, -22, 76, -106, 16, 67, -81, -22, -106, 9,
  89, -93, 45, 103, -100, -33, 108, 47, 96, -3, -25, -89, -52, 87, 4, -71, 73, -51, 31, 125, 81, -100, 47, 60, -91, 4,
  126, -102, -43, -21, 36, -98, 119, -52, 19, -21, 124, 4, 74, -19, -106, 121, -40, 65, 21, -21, -88, 103, 83, -105,
  -23, 26, -110, 38, 109, -77, -46, 118, -67, -122, -42, 51, -51, 112, -16, 57, -60, -118, 65, -73, -20, -85, -105, 39,
  20, -120, -10, 26, -101, 40, -90, -7, 50, -122, -66, 26, -33, 95, -74, -52, 25, 48, -124, -58, 94, -77, 0, 62, -126,
  90, -47, 41, -63, 56, -53, 38, -83, 105, -57, 58, -117, 30, -52, -4, 53, -66, -44, 65, -126, 87, 47, -92, 91, 2, 109,
  21, -88, 64, -125, 3, 121, 25, 77, 15, 85, -55, 70, 115, -43, 102, 51, -63, -32, 81, 112, -109, 91, -17, 67, -85, 7,
  -11, 80, -116, -27, -4, 105, 13, 73, -113, -27, 103, -68, -11, 67, -80, -116, -3, 78, -27, 11, -103, -1, 117, -74, 13,
  -30, 119, -93, 99, 80, -32, -10, 9, 25, -28, -14, 37, 79, -113, 95, -68, 33, -38, -81, -24, -49, -110, 127, 28, 7,
  -71, -97, 76, -80, 120, -127, 59, 8, -59, -38, 15, 105, -49, 120, -107, 36, 115, 56, -69, 66, -94, -14, 44, 23, -88,
  52, -105, 28, 107, 96, 18, 116, -93, 92, -66, 46, -42, -13, 78, 63, -123, 41, -76, 14, 123, -99, -64, 105, -119, 62,
  -79, -59, -6, -26, 14, 72, 107, -99, 97, -2, 52, -35, -124, -8, -31, 59, -17, 9, 34, -50, -24, 98, -82, 37, -98, 55,
  -118, 75, -62, 17, -45, 89, -84, 31, -35, 124, -63, 80, -43, 115, 12, -29, -98, -39, -71, -127, 32, -15, 71, -121, 86,
  35, -108, -62, 93, 1, -16, -117, 32, 52, -84, 70, -52, 127, -36, -101, 47, 117, -45, -109, -12, 40, 60, -67, -92, 37,
  -78, 95, 45, -116, 90, -107, 105, -3, 23, -114, 71, 123, -71, -26, -3, 43, -80, -18, -97, 6, -112, 110, -50, -120, 4,
  98, -109, -4, -56, 77, 43, -13, 63, -48, 52, -35, 123, 23, -91, 108, -82, -34, 20, -49, 109, 73, -57, -38, 93, -2,
  -110, 29, 8, 103, 59, -91, 82, -74, -57, 88, -119, 19, 103, -59, 65, 112, -52, 19, -68, -38, 65, -91, -73, 49, -14, 3,
  86, 29, 96, -36, 111, 68, 101, -30, 78, -9, 49, 87, -79, -32, 38, 69, -123, 127, -84, 7, 111, 88, -105, 3, -78, -25,
  -51, -5, 50, 126, -102, 59, -89, -25, -108, 114, 19, -23, 43, 81, -70, -17, -117, 34, -4, 22, 124, 6, -29, 78, -16,
  13, -111, -95, 79, -1, 124, 41, -56, 84, 117, -36, -102, -46, -125, -57, -89, -110, 22, 53, -127, 39, -59, 15, -104,
  27, 60, -93, 18, -73, -19, 92, -63, -109, 24, -89, -58, 105, 61, -113, 99, 8, 68, -19, 33, 87, -69, 42, 4, 61, -74,
  -95, -46, 99, -88, 17, -54, 67, -35, -128, 50, -86, -45, -103, 118, -3, -39, -21, 29, -83, -28, -99, -7, -123, 30, 75,
  107, 17, 60, 116, 80, -12, -50, -67, 1, -82, 121, 64, -71, -23, 118, -12, 107, 50, -46, 30, 57, -30, 74, -6, 45, 17,
  -67, 38, 77, -100, -73, -128, -43, -7, 12, 103, 82, -125, -10, 121, 72, -120, -30, 118, 87, -78, 106, 92, -21, 71, 30,
  -72, 47, -87, 84, 107, 49, -121, 72, 99, 57, -22, 6, -63, -84, 39, -20, -74, 47, 12, 127, -105, 92, -38, -15, -92,
  103, -45, -126, -58, 72, -113, -97, -2, 102, -119, -44, 122, -21, -118, 85, -13, -38, 28, -56, 95, 114, -114, 32, -53,
  -83, -41, 30, 48, -60, 5, 62, 40, -12, -108, 4, -95, -64, 113, -115, 98, 60, -126, 20, -67, -46, 8, 111, -75, 21, -46,
  92, -111, -29, 98, -97, -2, -120, 65, -28, 32, 76, 57, -112, 20, 81, -1, 44, 91, 8, -35, 114, 15, -76, 86, 36, -81,
  69, 32, -50, 119, -87, 107, 16, -26, 45, 77, 55, 24, -29, 110, 88, -111, -20, 23, -100, -42, -67, 53, 26, -50, 43, 15,
  -12, -33, -53, 39, 93, 64, -108, -13, -60, 37, -115, -88, 125, 48, 68, -52, 26, 109, -41, -84, 102, -98, 8, -52, 111,
  36, -33, -81, -106, 29, -67, -85, 78, 53, -57, -10, -103, 12, -34, 96, 51, 4, -121, 56, 72, -2, -80, -64, 121, -16,
  67, -102, -1, -72, 106, -86, 91, 111, -123, 79, 122, -37, 61, -101, 83, 6, 125, -25, -7, -80, 120, 54, -33, 89, 1, 64,
  -70, -11, 10, -106, 74, -68, 41, 88, -60, -19, -76, -6, -123, -64, 67, 99, 55, -26, 122, -15, 39, -122, -25, 116, 64,
  -64, 109, 22, -74, 34, -31, -61, -108, -94, 35, -38, 6, -122, 40, -59, 14, 54, 73, -50, -4, 34, 14, -24, -89, -5,
  -116, 105, -79, -62, 32, 16, -114, -38, 32, -92, 77, -104, -19, 104, -36, 31, -128, 117, -17, -34, 2, -112, 55, 25,
  119, 48, 94, 13, -97, -54, 5, -118, 84, -100, 19, -47, 94, -90, 46, -4, -126, -17, -107, 81, -7, 93, 125, -18, 86,
  -111, 101, -75, 92, -91, 126, -35, -127, 43, -28, -78, -57, 64, 95, -72, 74, -19, 34, 54, 70, 110, 81, 99, -64, 12,
  115, 25, -54, 44, -95, 84, -79, 51, 91, -90, 122, 16, 77, -119, -44, 83, -84, -22, 126, -10, 105, -42, 63, -61, 108,
  69, 5, -113, 28, -42, 89, -54, 117, 66, -84, -44, 43, 15, 60, -51, 22, -11, 75, -47, 31, -8, -98, 84, 119, -114, 104,
  -102, 6, 40, 20, -54, 117, -120, -45, -75, -102, 42, -2, -125, -44, -78, 73, -119, 113, 4, -43, -59, 21, -103, 63,
  -51, -11, -93, 35, -32, -108, 22, 53, -72, 39, -88, 27, -6, -80, -33, -70, 126, 75, -82, 57, 39, -93, 9, 26, -118,
  -72, 107, -29, -88, 118, 50, -26, -115, 61, 100, -68, 7, 58, 26, -15, 49, -45, -122, 100, -87, -35, 26, 2, 52, -55,
  -30, 68, -17, 102, 56, -5, -66, 18, -22, 60, 103, -5, 37, -74, -25, 95, -65, 114, 1, 70, -49, -120, 75, -103, 10, 93,
  -128, 53, 36, -104, -14, -28, 16, 106, -67, -22, -37, 98, 53, -56, 3, -127, 82, -68, -106, 10, 112, -81, -21, 20, -53,
  -90, -39, 81, -66, 127, -29, -8, 86, -108, 78, -14, -91, 95, 19, 126, -85, -109, 38, -31, 94, -108, 79, -87, -118,
  -31, 83, -114, 108, 44, 12, 61, -76, 102, 32, 89, -36, -18, 111, -55, -25, 119, 86, 13, 101, -56, -120, -100, 2, 79,
  -115, 122, -16, 70, -98, 34, -7, 66, -37, 28, -60, 87, -119, 72, 109, -109, 97, -1, -82, 70, 32, 58, 8, 45, -65, 120,
  32, 62, -117, -70, 7, 89, 23, -95, 120, -49, 46, 29, 126, -63, 68, 2, -86, -41, -102, -127, -19, -59, -98, -5, 118,
  -68, 44, 69, 3, -108, -64, -93, 60, 42, 88, 27, 113, -49, 44, -102, -78, 22, 94, 114, -48, 43, 98, -94, 1, 36, -40,
  47, -5, -27, 40, -126, 14, 33, 111, -58, -78, 106, -24, -128, -36, -8, -49, 46, 71, -39, -58, -10, 63, 8, -73, -13,
  -98, 13, -47, 117, 27, 56, -8, 82, 124, 49, 15, -82, 57, 21, -112, -90, -39, 31, 77, -46, -3, -84, -39, -11, -74, 65,
  18, -4, 84, -41, -25, -84, 13, -111, -77, 124, -16, 59, -101, 120, -86, -61, 67, 115, -48, -20, -114, 23, -41, -99,
  68, 12, -82, 83, 104, -103, -22, 117, -115, -79, 104, -123, -34, 73, 94, 53, -124, -21, 89, -56, 105, 21, -89, -43,
  -27, 99, -124, -47, 83, 101, -75, 51, -16, 109, -110, 69, 122, 51, -125, -30, -89, 109, -65, 40, -122, 57, -60, 81,
  -28, 72, -126, -50, 94, -73, 11, 27, 89, -97, -70, 48, 77, 90, -2, 37, 97, -60, -110, 115, 27, 0, -91, 81, 55, 26, 84,
  41, -55, 110, -83, -6, 35, -73, -94, -111, -31, -69, 37, 64, -106, 76, 6, 36, -22, -7, 15, 116, -124, 25, -30, 11,
  -62, 32, 96, 76, -55, 59, 10, -105, 121, -18, 100, 2, 24, 46, -65, 16, -9, 76, -120, -17, 55, -36, -7, 102, -105, -30,
  -122, 124, -17, 54, 17, -29, -76, -56, 40, 11, -68, -27, 0, -100, -18, 21, -108, -39, 102, 65, 17, 47, 75, 1, -117,
  90, -12, 109, -74, -60, 127, -100, 62, -54, -88, 89, -72, 100, 35, -15, 5, 31, -21, -117, 91, -8, 73, 28, -92, -116,
  -41, 103, -85, 115, 32, -39, 106, -54, -104, 123, 21, -87, 8, 64, -50, -72, -90, 76, 43, -122, 66, 95, -15, -126, 99,
  -48, -87, 123, 58, -69, 44, 82, -60, 4, 119, -48, -18, 111, -81, -53, 29, -37, -92, 71, 48, -117, 94, -34, 41, 1, 56,
  -117, -50, 112, -109, -73, 126, 46, -37, -78, -52, 50, -70, 116, -6, -104, 64, -26, -93, -110, 61, 43, 4, -77, 73, 39,
  -64, 115, 52, 29, 2, -46, -100, -11, 124, -40, 50, -105, 114, 33, 72, -117, 92, 7, 114, -121, -25, -86, -102, 92,
  -125, 55, 10, 121, 46, -114, -1, 21, -28, -81, 9, -66, 80, -104, -23, 73, -83, 48, 84, -43, -92, 20, 102, -102, 4,
  -32, 89, 59, -57, 83, 7, 40, 90, -3, -64, 82, -30, -114, 97, -44, -23, -95, -9, -117, 111, 88, 104, 6, -69, -94, 16,
  78, -33, -8, -61, 17, -45, -29, -94, 28, 74, -11, 39, -66, 27, -35, -98, -64, -21, 85, 58, 113, -47, 103, 32, -9, 123,
  -43, 105, 17, -4, -32, 24, 67, -12, -62, 79, 33, 110, -126, 14, 36, -82, -18, -120, -50, -76, 122, 18, -89, 112, 32,
  -12, -124, 82, 101, 12, 68, -34, -62, -85, 56, 34, 87, -51, -78, 62, 32, 106, 52, -80, -3, 61, -51, 127, 13, -40, 108,
  82, -6, 71, 22, 97, -104, -72, -127, 78, -17, -102, 68, -123, 24, -91, -60, 92, -128, -99, 115, 10, -120, 58, -87,
  -21, 69, -98, -40, 127, 23, 52, 102, -34, 69, -123, -20, -52, 57, -70, 17, 44, -56, -106, -77, 37, -21, 19, 72, -120,
  -28, 117, -1, 26, -119, -19, 38, -106, 89, 104, -114, -73, 53, -109, 62, -77, -115, 103, -86, -45, -8, 14, -58, 41,
  -90, 54, -51, -74, 49, -14, 64, 121, -69, 55, -53, 97, -28, -2, -45, 120, -73, -10, 97, -110, -66, 74, -97, -10, 29,
  48, 93, 11, -99, 67, 125, -85, -37, 56, 119, 79, -114, -3, -57, 109, -13, -107, 46, -68, 93, 125, -40, 71, -62, -16,
  45, 0, 96, -92, -18, -50, 6, 48, -26, 62, 35, 124, -33, 91, -1, 117, 11, 87, 109, -37, -112, 38, 4, -20, 29, -78,
  -112, 88, 41, 23, -55, 48, 79, 1, -27, 112, 9, -60, -107, -44, -80, 108, -34, -5, -111, 88, 4, 25, -14, -47, 96, -101,
  -36, 23, -83, 97, 66, 10, -53, -89, 1, 29, -124, 16, -85, -33, -56, 111, 18, 37, 123, -66, -123, 109, 32, 74, -80, 25,
  -119, -66, -29, -115, 33, 0, -80, -48, 85, -92, 104, 48, 72, -65, -103, 100, -121, 9, -92, -47, 41, -128, -83, 57,
  119, 83, 1, -118, 75, -60, 38, -24, 103, -127, -66, -91, 51, 127, -72, 81, 40, -42, -125, -27, 83, 54, -74, 107, -26,
  117, 86, 67, 30, -128, 74, -32, -101, 85, 26, -54, 5, -112, -20, 60, -41, 99, 70, -18, 32, 75, 100, 20, 62, -121, -36,
  -13, 125, 17, -31, 65, -19, 56, 118, -77, 90, 64, 20, 100, -24, 36, -67, 23, 47, 117, -78, -49, -97, 61, 111, 11, 33,
  -121, 64, 2, -95, -61, 121, -6, -113, 20, -103, 78, -49, 32, 41, -108, -8, -65, 91, -83, -2, 66, -15, -38, 94, 50,
  -61, 106, -101, 45, 21, -77, 126, -57, -108, -26, 116, -63, 11, -102, -48, -91, 3, -81, 110, -114, -35, 31, -16, -54,
  -5, -39, -95, -113, -13, 99, -91, -18, 15, 80, 30, -7, -41, 86, -24, 100, -16, 48, 106, 14, 34, 70, 102, -37, 44, -11,
  60, 5, -78, -41, 121, 11, 46, -44, 113, -117, -76, 42, -90, 118, 15, -11, 78, -87, -5, -44, 39, 10, 54, -8, -86, 42,
  69, 28, 108, 81, 35, -58, 85, 18, -68, 102, -103, -117, 82, -72, 51, 78, -53, 63, -40, -123, 54, 96, -71, -117, 71,
  -83, -55, 21, -46, -110, -31, -79, -101, -17, -70, -87, 119, -59, -118, 92, 23, -21, 72, -116, -93, -22, 53, 98, 19,
  79, -4, -126, -74, 33, -52, -115, 109, 61, 94, -126, -70, 80, -42, 96, -2, -76, -127, 53, -11, -107, -43, 44, -4, 73,
  8, 125, 39, 106, 3, 19, 122, -81, 8, 108, -108, 0, -34, 123, 43, 5, -103, 75, -73, 90, 60, 113, -53, 52, 93, 30, 12,
  -31, 111, -67, 52, 100, -53, 106, 27, -69, 6, -56, -109, -27, 58, -43, 85, -31, 122, 8, -66, -103, -32, -15, 113, 24,
  -98, -114, 121, -34, -61, -24, 98, 67, 122, 32, -25, -85, 59, -63, -28, -86, -125, -43, -105, 32, -28, 69, -55, 40,
  -89, -15, -62, 56, 107, 36, -12, -128, -2, 23, 81, -110, -44, -5, -125, 66, 35, -110, -3, -87, -104, 58, -10, 80, 125,
  -97, 35, 110, -63, 102, -106, 66, 51, -20, 87, 31, 74, -91, 47, 5, -55, 57, -17, 89, 39, -110, 10, -72, 25, -124, 95,
  -50, 33, -99, 22, 71, -9, 56, 94, -66, 84, -9, -99, 116, 17, 90, -111, -28, -93, 10, 124, -59, 43, -88, -25, 7, 124,
  -95, 86, -80, -16, 76, -35, 17, 39, -31, -80, -123, 65, -36, -12, -82, 12, 27, -91, 1, -79, -123, 18, -54, -1, -76,
  -38, 103, 83, 33, -84, 19, 73, 104, -87, -37, 1, 51, 77, 116, -12, -39, 91, 114, -57, -23, 110, -92, 48, 25, -75, 76,
  -51, 63, 29, 114, -42, 87, -105, 64, -38, 100, -116, 74, 42, -58, 54, 107, -48, -98, 126, 85, -63, 115, 93, 13, -51,
  43, 90, 69, -121, -23, 43, 98, -39, 113, -95, 101, 52, 120, -107, -23, -124, -68, -44, 2, 32, -52, 58, 110, -18, -60,
  -78, 11, -104, 46, -120, 7, -75, 41, -115, 6, -40, -127, 101, -23, 3, -120, -77, -4, -67, 51, -20, -80, 16, 116, -64,
  -13, -77, 17, -27, 1, 26, -71, 47, -126, -44, 0, 31, -19, -112, -71, 116, -1, -48, 123, 75, -58, -10, 37, 63, -26,
  -113, -61, 38, 68, 14, 114, 62, -118, 123, -8, 30, -119, 88, 38, -114, -30, 106, -67, 60, -90, 81, 23, 68, -15, 127,
  -61, 58, -104, -37, 45, 99, 72, -116, 106, 31, 83, -6, -98, 35, -42, 68, 91, -106, -119, 97, 60, 8, -13, 68, -109,
  -92, 109, 56, 24, -88, -101, 53, -69, -113, 22, -103, -73, -48, 9, 81, 25, 93, -4, -90, -15, 97, -28, 47, -65, 80,
  -45, -99, 127, 66, 24, 76, -5, -47, 123, -33, -107, -52, -81, 90, 16, 35, 112, 83, -87, -18, 23, -49, -89, -30, -120,
  -53, 95, 59, -123, 111, -86, 33, 119, -54, -33, -87, 105, -76, 42, 76, -65, -32, 85, 7, -16, 80, -32, 10, 95, 50, 88,
  123, -121, -12, -79, -42, -102, -53, 42, -75, 85, -107, 21, -82, -25, 14, -9, -91, -55, 99, -111, -20, 31, 88, -3,
  105, 53, -29, -90, -10, -70, 9, -57, 123, -99, 5,
];

const clamp = function (a, b, c) {
  return Math.max(b, Math.min(c, a));
};

const randomInt = function (max) {
  return Math.floor(Math.random() * max);
};

export function PnnLABQuant(opts) {
  this.opts = opts;
  this.hasSemiTransparency = false;
  this.m_transparentPixelIndex = -1;
  this.m_transparentColor = 0xffffff;
  this.palette = [];
  this.qPixels = [];
}

let alphaThreshold = 0xf,
  hasAlpha = false,
  hasSemiTransparency = false,
  transparentColor;
let PR = 0.299,
  PG = 0.587,
  PB = 0.114,
  PA = 0.3333;
let ratio = 1.0;
let closestMap = new Map(),
  pixelMap = new Map(),
  nearestMap = new Map();

let XYZ_WHITE_REFERENCE_X = 95.047,
  XYZ_WHITE_REFERENCE_Y = 100,
  XYZ_WHITE_REFERENCE_Z = 108.883;
let XYZ_EPSILON = 0.008856,
  XYZ_KAPPA = 903.3;

function Lab() {
  this.alpha = 255;
  this.A = this.B = this.L = 0;
}

let coeffs = [
  [0.299, 0.587, 0.114],
  [-0.14713, -0.28886, 0.436],
  [0.615, -0.51499, -0.10001],
];

function Pnnbin() {
  this.ac = this.Lc = this.Ac = this.Bc = 0;
  this.cnt = 0;
  this.nn = this.fw = this.bk = this.tm = this.mtm = 0;
  this.err = 0.0;
}

function pivotXyzComponent(component) {
  return component > XYZ_EPSILON
    ? Math.fround(Math.cbrt(component))
    : Math.fround((XYZ_KAPPA * component + 16) / 116.0);
}

function RGB2LAB(A, R, G, B) {
  let sr = R / 255.0;
  sr = sr < 0.04045 ? sr / 12.92 : Math.pow((sr + 0.055) / 1.055, 2.4);
  let sg = G / 255.0;
  sg = sg < 0.04045 ? sg / 12.92 : Math.pow((sg + 0.055) / 1.055, 2.4);
  let sb = B / 255.0;
  sb = sb < 0.04045 ? sb / 12.92 : Math.pow((sb + 0.055) / 1.055, 2.4);
  let x = pivotXyzComponent((100 * (sr * 0.4124 + sg * 0.3576 + sb * 0.1805)) / XYZ_WHITE_REFERENCE_X);
  let y = pivotXyzComponent((100 * (sr * 0.2126 + sg * 0.7152 + sb * 0.0722)) / XYZ_WHITE_REFERENCE_Y);
  let z = pivotXyzComponent((100 * (sr * 0.0193 + sg * 0.1192 + sb * 0.9505)) / XYZ_WHITE_REFERENCE_Z);

  let lab = new Lab();
  (lab.alpha = A), (lab.L = Math.max(0, 116 * y - 16)), (lab.A = 500 * (x - y)), (lab.B = 200 * (y - z));
  return lab;
}

function LAB2RGB(lab) {
  let fy = (lab.L + 16.0) / 116.0;
  let fx = lab.A / 500 + fy;
  let fz = fy - lab.B / 200.0;
  let tmp = fx * fx * fx;
  let xr = tmp > XYZ_EPSILON ? tmp : (116.0 * fx - 16) / XYZ_KAPPA;
  let yr = lab.L > XYZ_KAPPA * XYZ_EPSILON ? fy * fy * fy : lab.L / XYZ_KAPPA;
  tmp = fz * fz * fz;
  let zr = tmp > XYZ_EPSILON ? tmp : (116.0 * fz - 16) / XYZ_KAPPA;
  let x = xr * XYZ_WHITE_REFERENCE_X;
  let y = yr * XYZ_WHITE_REFERENCE_Y;
  let z = zr * XYZ_WHITE_REFERENCE_Z;

  let r = (x * 3.2406 + y * -1.5372 + z * -0.4986) / 100.0;
  let g = (x * -0.9689 + y * 1.8758 + z * 0.0415) / 100.0;
  let b = (x * 0.0557 + y * -0.204 + z * 1.057) / 100.0;
  r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
  g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
  b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

  let a = clamp(Math.round(lab.alpha), 0, 0xff);
  (r = clamp(Math.round(r * 0xff), 0, 0xff)),
    (g = clamp(Math.round(g * 0xff), 0, 0xff)),
    (b = clamp(Math.round(b * 0xff), 0, 0xff));
  return (a << 24) | (b << 16) | (g << 8) | r;
}

function deg2Rad(deg) {
  return Math.fround(deg * (Math.PI / 180.0));
}

function L_prime_div_k_L_S_L(lab1, lab2) {
  let k_L = 1.0;
  let deltaLPrime = lab2.L - lab1.L;
  let barLPrime = (lab1.L + lab2.L) / 2.0;
  let S_L = 1 + (0.015 * sqr(barLPrime - 50.0)) / Math.sqrt(20 + sqr(barLPrime - 50.0));
  return Math.fround(deltaLPrime / (k_L * S_L));
}

function C_prime_div_k_L_S_L(lab1, lab2, a1Prime, a2Prime, CPrime1, CPrime2) {
  let k_C = 1.0;
  let pow25To7 = 6103515625.0; /* pow(25, 7) */
  let C1 = Math.sqrt(lab1.A * lab1.A + lab1.B * lab1.B);
  let C2 = Math.sqrt(lab2.A * lab2.A + lab2.B * lab2.B);
  let barC = (C1 + C2) / 2.0;
  let G = 0.5 * (1 - Math.sqrt(Math.pow(barC, 7) / (Math.pow(barC, 7) + pow25To7)));
  a1Prime.value = (1.0 + G) * lab1.A;
  a2Prime.value = (1.0 + G) * lab2.A;

  CPrime1.value = Math.sqrt(a1Prime.value * a1Prime.value + lab1.B * lab1.B);
  CPrime2.value = Math.sqrt(a2Prime.value * a2Prime.value + lab2.B * lab2.B);
  let deltaCPrime = CPrime2.value - CPrime1.value;
  let barCPrime = (CPrime1.value + CPrime2.value) / 2.0;

  let S_C = 1 + 0.045 * barCPrime;
  return Math.fround(deltaCPrime / (k_C * S_C));
}

function H_prime_div_k_L_S_L(lab1, lab2, a1Prime, a2Prime, CPrime1, CPrime2, barCPrime, barhPrime) {
  const k_H = 1.0;
  let deg360InRad = deg2Rad(360.0);
  let deg180InRad = deg2Rad(180.0);
  let CPrimeProduct = CPrime1 * CPrime2;
  let hPrime1;
  if (lab1.B == 0.0 && a1Prime == 0.0) hPrime1 = 0.0;
  else {
    hPrime1 = Math.atan2(lab1.B, a1Prime);
    /*
     * This must be converted to a hue angle in degrees between 0
     * and 360 by addition of 2π to negative hue angles.
     */
    if (hPrime1 < 0) hPrime1 += deg360InRad;
  }
  let hPrime2;
  if (lab2.B == 0.0 && a2Prime == 0.0) hPrime2 = 0.0;
  else {
    hPrime2 = Math.atan2(lab2.B, a2Prime);
    /*
     * This must be converted to a hue angle in degrees between 0
     * and 360 by addition of 2π to negative hue angles.
     */
    if (hPrime2 < 0) hPrime2 += deg360InRad;
  }
  let deltahPrime;
  if (CPrimeProduct == 0.0) deltahPrime = 0;
  else {
    /* Avoid the Math.abs() call */
    deltahPrime = hPrime2 - hPrime1;
    if (deltahPrime < -deg180InRad) deltahPrime += deg360InRad;
    else if (deltahPrime > deg180InRad) deltahPrime -= deg360InRad;
  }

  let deltaHPrime = 2.0 * Math.sqrt(CPrimeProduct) * Math.sin(deltahPrime / 2.0);
  let hPrimeSum = hPrime1 + hPrime2;
  if (CPrime1 * CPrime2 == 0.0) {
    barhPrime.value = hPrimeSum;
  } else {
    if (Math.abs(hPrime1 - hPrime2) <= deg180InRad) barhPrime.value = hPrimeSum / 2.0;
    else {
      if (hPrimeSum < deg360InRad) barhPrime.value = (hPrimeSum + deg360InRad) / 2.0;
      else barhPrime.value = (hPrimeSum - deg360InRad) / 2.0;
    }
  }

  barCPrime.value = (CPrime1 + CPrime2) / 2.0;
  let T =
    1.0 -
    0.17 * Math.cos(barhPrime.value - deg2Rad(30.0)) +
    0.24 * Math.cos(2.0 * barhPrime.value) +
    0.32 * Math.cos(3.0 * barhPrime.value + deg2Rad(6.0)) -
    0.2 * Math.cos(4.0 * barhPrime.value - deg2Rad(63.0));
  let S_H = 1 + 0.015 * barCPrime.value * T;
  return Math.fround(deltaHPrime / (k_H * S_H));
}

function R_T(barCPrime, barhPrime, C_prime_div_k_L_S_L, H_prime_div_k_L_S_L) {
  let pow25To7 = 6103515625.0; /* Math.pow(25, 7) */
  let deltaTheta = deg2Rad(30.0) * Math.exp(-Math.pow((barhPrime - deg2Rad(275.0)) / deg2Rad(25.0), 2.0));
  let R_C = 2.0 * Math.sqrt(Math.pow(barCPrime, 7.0) / (Math.pow(barCPrime, 7.0) + pow25To7));
  let R_T = -Math.sin(2.0 * deltaTheta) * R_C;
  return Math.fround(R_T * C_prime_div_k_L_S_L * H_prime_div_k_L_S_L);
}

function getARGBIndex(a, r, g, b, hasSemiTransparency, hasTransparency) {
  if (hasSemiTransparency) return ((a & 0xf0) << 8) | ((r & 0xf0) << 4) | (g & 0xf0) | (b >> 4);
  if (hasTransparency) return ((a & 0x80) << 8) | ((r & 0xf8) << 7) | ((g & 0xf8) << 2) | (b >> 3);
  return ((r & 0xf8) << 8) | ((g & 0xfc) << 3) | (b >> 3);
}

function sqr(value) {
  return value * value;
}

function getLab(a, r, g, b) {
  let argb = (a << 24) | (b << 16) | (g << 8) | r;
  let lab1 = pixelMap.get(argb);
  if (lab1 == null) {
    lab1 = RGB2LAB(a, r, g, b);
    pixelMap.set(argb, lab1);
  }
  return lab1;
}

function find_nn(bins, idx, nMaxColors, texicab) {
  let nn = 0;
  let err = 1e100;

  let bin1 = bins[idx];
  let n1 = bin1.cnt;
  let lab1 = new Lab();
  lab1.alpha = bin1.ac;
  lab1.L = bin1.Lc;
  lab1.A = bin1.Ac;
  lab1.B = bin1.Bc;
  for (let i = bin1.fw; i != 0; i = bins[i].fw) {
    let n2 = bins[i].cnt,
      nerr2 = (n1 * n2) / (n1 + n2);
    if (nerr2 >= err) continue;

    let lab2 = new Lab();
    lab2.alpha = bins[i].ac;
    lab2.L = bins[i].Lc;
    lab2.A = bins[i].Ac;
    lab2.B = bins[i].Bc;
    let alphaDiff = hasSemiTransparency ? sqr(lab2.alpha - lab1.alpha) / Math.exp(1.5) : 0;
    let nerr = nerr2 * alphaDiff;
    if (nerr >= err) continue;

    if (!texicab) {
      nerr += (1 - ratio) * nerr2 * sqr(lab2.L - lab1.L);
      if (nerr >= err) continue;

      nerr += (1 - ratio) * nerr2 * sqr(lab2.A - lab1.A);
      if (nerr >= err) continue;

      nerr += (1 - ratio) * nerr2 * sqr(lab2.B - lab1.B);
    } else {
      nerr += (1 - ratio) * nerr2 * Math.abs(lab2.L - lab1.L);
      if (nerr >= err) continue;

      nerr += (1 - ratio) * nerr2 * Math.sqrt(sqr(lab2.A - lab1.A) + sqr(lab2.B - lab1.B));
    }

    if (nerr >= err) continue;

    let deltaL_prime_div_k_L_S_L = L_prime_div_k_L_S_L(lab1, lab2);
    nerr += ratio * nerr2 * sqr(deltaL_prime_div_k_L_S_L);
    if (nerr >= err) continue;

    let a1Prime = {},
      a2Prime = {},
      CPrime1 = {},
      CPrime2 = {};
    let deltaC_prime_div_k_L_S_L = C_prime_div_k_L_S_L(lab1, lab2, a1Prime, a2Prime, CPrime1, CPrime2);
    nerr += ratio * nerr2 * sqr(deltaC_prime_div_k_L_S_L);
    if (nerr >= err) continue;

    let barCPrime = {},
      barhPrime = {};
    let deltaH_prime_div_k_L_S_L = H_prime_div_k_L_S_L(
      lab1,
      lab2,
      a1Prime.value,
      a2Prime.value,
      CPrime1.value,
      CPrime2.value,
      barCPrime,
      barhPrime
    );
    nerr += ratio * nerr2 * sqr(deltaH_prime_div_k_L_S_L);
    if (nerr >= err) continue;

    nerr += ratio * nerr2 * R_T(barCPrime.value, barhPrime.value, deltaC_prime_div_k_L_S_L, deltaH_prime_div_k_L_S_L);
    if (nerr >= err) continue;

    err = nerr;
    nn = i;
  }
  bin1.err = Math.fround(err);
  bin1.nn = nn;
}

function getQuanFn(nMaxColors, quan_rt) {
  if (quan_rt > 0) {
    if (quan_rt > 1)
      return function (cnt) {
        return Math.pow(cnt, 0.75) | 0;
      };
    if (nMaxColors < 64)
      return function (cnt) {
        return Math.sqrt(cnt) | 0;
      };
    return function (cnt) {
      return Math.fround(Math.sqrt(cnt));
    };
  }
  return function (cnt) {
    return cnt;
  };
}

PnnLABQuant.prototype.pnnquan = function pnnquan(pixels, nMaxColors) {
  let quan_rt = 1;
  let bins = new Array(65536);
  let saliencies = new Float32Array(pixels.length);
  let saliencyBase = 0.1;

  /* Build histogram */
  for (let i = 0; i < pixels.length; ++i) {
    // !!! Can throw gamma correction in here, but what to do about perceptual
    // !!! nonuniformity then?
    let r = pixels[i] & 0xff,
      g = (pixels[i] >>> 8) & 0xff,
      b = (pixels[i] >>> 16) & 0xff,
      a = (pixels[i] >>> 24) & 0xff;

    if (a <= alphaThreshold) {
      (r = this.m_transparentColor & 0xff),
        (g = (this.m_transparentColor >>> 8) & 0xff),
        (b = (this.m_transparentColor >>> 16) & 0xff),
        (a = (this.m_transparentColor >>> 24) & 0xff);
    }

    let index = getARGBIndex(a, r, g, b, this.hasSemiTransparency, this.m_transparentPixelIndex >= 0);
    let lab1 = getLab(a, r, g, b);

    if (bins[index] == null) bins[index] = new Pnnbin();
    let tb = bins[index];
    tb.ac += a;
    tb.Lc += lab1.L;
    tb.Ac += lab1.A;
    tb.Bc += lab1.B;
    tb.cnt += 1.0;
    if (a > alphaThreshold) saliencies[i] = saliencyBase + ((1 - saliencyBase) * lab1.L) / 100;
  }
  this.opts.saliencies = saliencies;

  /* Cluster nonempty bins at one end of array */
  let maxbins = 0;
  for (let i = 0; i < bins.length; ++i) {
    if (bins[i] == null) continue;

    let d = 1.0 / bins[i].cnt;
    bins[i].ac *= d;
    bins[i].Lc *= d;
    bins[i].Ac *= d;
    bins[i].Bc *= d;

    bins[maxbins++] = bins[i];
  }

  let proportional = sqr(nMaxColors) / maxbins;
  if ((this.m_transparentPixelIndex >= 0 || this.hasSemiTransparency) && nMaxColors < 32) quan_rt = -1;

  let weight = (this.opts.weight = Math.min(0.9, (nMaxColors * 1.0) / maxbins));
  if (weight > 0.0015 && weight < 0.002) quan_rt = 2;
  if (weight < 0.04 && PG < 1 && PG >= coeffs[0][1]) {
    let delta = Math.exp(1.75) * weight;
    PG -= delta;
    PB += delta;
    if (nMaxColors >= 64) quan_rt = 0;
  }

  if (pixelMap.size <= nMaxColors) {
    /* Fill palette */
    this.palette = new Uint32Array(pixelMap.size);
    let k = 0;
    for (let pixel of pixelMap.keys()) {
      this.palette[k] = pixel;

      if (k > 1 && ((pixel >>> 24) & 0xff) == 0) {
        this.palette[k] = this.palette[0];
        this.palette[0] = pixel;
        if ((this.palette[k] >>> 24) & (0xff == 0)) this.palette[k] |= 0xff00000000;
      }
      ++k;
    }

    return;
  }

  let quanFn = getQuanFn(nMaxColors, quan_rt);

  let j = 0;
  for (; j < maxbins - 1; ++j) {
    bins[j].fw = j + 1;
    bins[j + 1].bk = j;

    bins[j].cnt = quanFn(bins[j].cnt);
  }
  bins[j].cnt = quanFn(bins[j].cnt);

  let texicab = proportional > 0.0275;

  if (this.hasSemiTransparency) ratio = 0.5;
  else if (quan_rt != 0 && nMaxColors < 64) {
    if (proportional > 0.018 && proportional < 0.022) ratio = Math.min(1.0, proportional + weight * Math.exp(3.13));
    else if (proportional > 0.1) ratio = Math.min(1.0, 1.0 - weight);
    else if (proportional > 0.04) ratio = Math.min(1.0, weight * Math.exp(1.56));
    else if (proportional > 0.03) ratio = Math.min(1.0, proportional + weight * Math.exp(3.66));
    else ratio = Math.min(1.0, proportional + weight * Math.exp(1.718));
  } else if (nMaxColors > 256) ratio = Math.min(1.0, 1 - 1.0 / proportional);
  else ratio = Math.min(1.0, 1 - weight * 0.7);

  if (!this.hasSemiTransparency && quan_rt < 0) ratio = Math.min(1.0, weight * Math.exp(3.13));

  let h, l, l2;
  /* Initialize nearest neighbors and build heap of them */
  let heap = new Uint32Array(bins.length + 1);
  for (let i = 0; i < maxbins; ++i) {
    find_nn(bins, i, nMaxColors, texicab);
    /* Push slot on heap */
    let err = bins[i].err;
    for (l = ++heap[0]; l > 1; l = l2) {
      l2 = l >> 1;
      if (bins[(h = heap[l2])].err <= err) break;
      heap[l] = h;
    }
    heap[l] = i;
  }

  if (quan_rt > 0 && nMaxColors < 64 && proportional > 0.035 && proportional < 0.1) {
    let dir = proportional > 0.04 ? 1 : -1;
    let delta = weight > 0.0025 && weight < 0.003 ? 1.872 : 1.632;
    ratio = Math.min(1.0, proportional + dir * weight * Math.exp(delta));
  }

  /* Merge bins which increase error the least */
  let extbins = maxbins - nMaxColors;
  for (let i = 0; i < extbins; ) {
    let tb;
    /* Use heap to find which bins to merge */
    for (;;) {
      let b1 = heap[1];
      tb = bins[b1]; /* One with least error */
      /* Is stored error up to date? */
      if (tb.tm >= tb.mtm && bins[tb.nn].mtm <= tb.tm) break;
      if (tb.mtm == 0xffff) /* Deleted node */ b1 = heap[1] = heap[heap[0]--];
      /* Too old error value */ else {
        find_nn(bins, b1, nMaxColors, texicab && proportional < 1);
        tb.tm = i;
      }
      /* Push slot down */
      let err = bins[b1].err;
      for (l = 1; (l2 = l + l) <= heap[0]; l = l2) {
        if (l2 < heap[0] && bins[heap[l2]].err > bins[heap[l2 + 1]].err) ++l2;
        if (err <= bins[(h = heap[l2])].err) break;
        heap[l] = h;
      }
      heap[l] = b1;
    }

    /* Do a merge */
    let nb = bins[tb.nn];
    let n1 = tb.cnt;
    let n2 = nb.cnt;
    let d = 1.0 / (n1 + n2);
    tb.ac = d * (n1 * tb.ac + n2 * nb.ac);
    tb.Lc = d * (n1 * tb.Lc + n2 * nb.Lc);
    tb.Ac = d * (n1 * tb.Ac + n2 * nb.Ac);
    tb.Bc = d * (n1 * tb.Bc + n2 * nb.Bc);
    tb.cnt += n2;
    tb.mtm = ++i;

    /* Unchain deleted bin */
    bins[nb.bk].fw = nb.fw;
    bins[nb.fw].bk = nb.bk;
    nb.mtm = 0xffff;
  }

  /* Fill palette */
  if (extbins < 0) this.palette = new Uint32Array(maxbins);

  let k = 0;
  for (let i = 0; ; ++k) {
    let lab1 = new Lab();
    (lab1.alpha =
      this.hasSemiTransparency || this.m_transparentPixelIndex >= 0
        ? clamp(Math.round(bins[i].ac), 0, 0xff) | 0
        : 0xff),
      (lab1.L = bins[i].Lc);
    lab1.A = bins[i].Ac;
    lab1.B = bins[i].Bc;

    this.palette[k] = LAB2RGB(lab1);

    if ((i = bins[i].fw) == 0) break;
  }
};

function nearestColorIndex(palette, pixel, _pos) {
  let k = 0;
  let a = (pixel >>> 24) & 0xff;
  if (a <= alphaThreshold) {
    pixel = transparentColor;
    a = (pixel >>> 24) & 0xff;
  }

  let nearest = nearestMap.get(pixel);
  if (nearest != null) return nearest;

  if (palette.length > 2 && hasAlpha && a > alphaThreshold) k = 1;

  let r = pixel & 0xff,
    g = (pixel >>> 8) & 0xff,
    b = (pixel >>> 16) & 0xff;

  let mindist = 1e100;
  let lab1 = getLab(a, r, g, b);
  for (let i = k; i < palette.length; ++i) {
    let r2 = palette[i] & 0xff,
      g2 = (palette[i] >>> 8) & 0xff,
      b2 = (palette[i] >>> 16) & 0xff,
      a2 = (palette[i] >>> 24) & 0xff;
    let curdist = hasSemiTransparency ? sqr(a2 - a) / Math.exp(1.5) : 0;
    if (curdist > mindist) continue;

    let lab2 = getLab(a2, r2, g2, b2);
    if (palette.length <= 4) {
      curdist = sqr(r2 - r) + sqr(g2 - g) + sqr(b2 - b);
      if (hasSemiTransparency) curdist += sqr(a2 - a);
    } else if (hasSemiTransparency) {
      curdist += sqr(lab2.L - lab1.L);
      if (curdist > mindist) continue;

      curdist += sqr(lab2.A - lab1.A);
      if (curdist > mindist) continue;

      curdist += sqr(lab2.B - lab1.B);
    } else if (palette.length > 32) {
      curdist += Math.abs(lab2.L - lab1.L);
      if (curdist > mindist) continue;

      curdist += Math.sqrt(sqr(lab2.A - lab1.A) + sqr(lab2.B - lab1.B));
    } else {
      let deltaL_prime_div_k_L_S_L = L_prime_div_k_L_S_L(lab1, lab2);
      curdist += sqr(deltaL_prime_div_k_L_S_L);
      if (curdist > mindist) continue;

      let a1Prime = {},
        a2Prime = {},
        CPrime1 = {},
        CPrime2 = {};
      let deltaC_prime_div_k_L_S_L = C_prime_div_k_L_S_L(lab1, lab2, a1Prime, a2Prime, CPrime1, CPrime2);
      curdist += sqr(deltaC_prime_div_k_L_S_L);
      if (curdist > mindist) continue;

      let barCPrime = {},
        barhPrime = {};
      let deltaH_prime_div_k_L_S_L = H_prime_div_k_L_S_L(
        lab1,
        lab2,
        a1Prime.value,
        a2Prime.value,
        CPrime1.value,
        CPrime2.value,
        barCPrime,
        barhPrime
      );
      curdist += sqr(deltaH_prime_div_k_L_S_L);
      if (curdist > mindist) continue;

      curdist += R_T(barCPrime.value, barhPrime.value, deltaC_prime_div_k_L_S_L, deltaH_prime_div_k_L_S_L);
    }

    if (curdist > mindist) continue;
    mindist = curdist;
    k = i;
  }
  nearestMap.set(pixel, k);
  return k;
}

function closestColorIndex(palette, pixel, pos) {
  let a = (pixel >>> 24) & 0xff;
  if (a <= alphaThreshold) return nearestColorIndex(palette, pixel, pos);

  let r = pixel & 0xff,
    g = (pixel >>> 8) & 0xff,
    b = (pixel >>> 16) & 0xff;

  let closest = closestMap.get(pixel);
  if (closest == null) {
    closest = new Array(4);
    closest[2] = closest[3] = 0xffff;

    let start = 0;
    if (RAW_BLUE_NOISE[pos & 4095] > -88) start = 1;

    for (let k = 0; k < palette.length; ++k) {
      let r2 = palette[k] & 0xff,
        g2 = (palette[k] >>> 8) & 0xff,
        b2 = (palette[k] >>> 16) & 0xff,
        a2 = (palette[k] >>> 24) & 0xff;

      let _lab2 = getLab(a2, r2, g2, b2);
      let err = PR * (1 - ratio) * sqr(r2 - r);
      if (err >= closest[3]) continue;

      err += PG * (1 - ratio) * sqr(g2 - g);
      if (err >= closest[3]) continue;

      err += PB * (1 - ratio) * sqr(b2 - b);
      if (err >= closest[3]) continue;

      if (hasSemiTransparency) {
        err += PA * (1 - ratio) * sqr(a2 - a);
        start = 1;
      }

      for (let i = start; i < coeffs.length; ++i) {
        err += ratio * sqr(coeffs[i][0] * (r2 - r));
        if (err >= closest[3]) break;

        err += ratio * sqr(coeffs[i][1] * (g2 - g));
        if (err >= closest[3]) break;

        err += ratio * sqr(coeffs[i][2] * (b2 - b));
        if (err >= closest[3]) break;
      }

      if (err < closest[2]) {
        closest[1] = closest[0];
        closest[3] = closest[2];
        closest[0] = k;
        closest[2] = err | 0;
      } else if (err < closest[3]) {
        closest[1] = k;
        closest[3] = err | 0;
      }
    }

    if (closest[3] == 0xffff) closest[1] = closest[0];

    closestMap.set(pixel, closest);
  }

  let MAX_ERR = palette.length;
  if (palette.length > 32) {
    MAX_ERR <<= 1;
    if (r > 0xf0 && g > 0xf0 && b > 0xf0) MAX_ERR >>= 1;
  }

  if (PG < coeffs[0][1] && RAW_BLUE_NOISE[pos & 4095] > -88) return nearestColorIndex(palette, pixel, pos);

  let idx = 1;
  if (closest[2] == 0 || randomInt(32767) % (closest[3] + closest[2]) <= closest[3]) idx = 0;

  if (closest[idx + 2] >= MAX_ERR || (hasAlpha && closest[idx] == 0)) return nearestColorIndex(palette, pixel, pos);
  return closest[idx];
}

function calcDitherPixel(a, r, g, b, clamp, rowerr, cursor, noBias) {
  let ditherPixel = new Int32Array(4);
  if (noBias) {
    ditherPixel[0] = clamp[((rowerr[cursor] + 0x1008) >> 4) + r];
    ditherPixel[1] = clamp[((rowerr[cursor + 1] + 0x1008) >> 4) + g];
    ditherPixel[2] = clamp[((rowerr[cursor + 2] + 0x1008) >> 4) + b];
    ditherPixel[3] = clamp[((rowerr[cursor + 3] + 0x1008) >> 4) + a];
    return ditherPixel;
  }

  ditherPixel[0] = clamp[((rowerr[cursor] + 0x2010) >> 5) + r];
  ditherPixel[1] = clamp[((rowerr[cursor + 1] + 0x1008) >> 4) + g];
  ditherPixel[2] = clamp[((rowerr[cursor + 2] + 0x2010) >> 5) + b];
  ditherPixel[3] = a;
  return ditherPixel;
}

PnnLABQuant.prototype.quantize_image = function quantize_image(pixels, nMaxColors, width, height, dither) {
  let qPixels = nMaxColors > 256 ? new Uint16Array(pixels.length) : new Uint8Array(pixels.length);
  let pixelIndex = 0;
  if (dither) {
    const DJ = 4,
      BLOCK_SIZE = 256,
      DITHER_MAX = 16;
    let err_len = (width + 2) * DJ;
    let clamp = new Int32Array(DJ * BLOCK_SIZE);
    let limtb = new Int32Array(2 * BLOCK_SIZE);

    for (let i = 0; i < BLOCK_SIZE; ++i) {
      clamp[i] = 0;
      clamp[i + BLOCK_SIZE] = i;
      clamp[i + BLOCK_SIZE * 2] = 0xff;
      clamp[i + BLOCK_SIZE * 3] = 0xff;

      limtb[i] = -DITHER_MAX;
      limtb[i + BLOCK_SIZE] = DITHER_MAX;
    }
    for (let i = -DITHER_MAX; i <= DITHER_MAX; ++i) {
      limtb[i + BLOCK_SIZE] = i;
      if (nMaxColors > 16 && i % 4 == 3) limtb[i + BLOCK_SIZE] = 0;
    }

    let noBias = this.hasSemiTransparency || nMaxColors < 64;
    let dir = 1;
    let row0 = new Int32Array(err_len);
    let row1 = new Int32Array(err_len);
    let lookup = new Int32Array(65536);
    for (let i = 0; i < height; ++i) {
      if (dir < 0) pixelIndex += width - 1;

      let cursor0 = DJ,
        cursor1 = width * DJ;
      row1[cursor1] = row1[cursor1 + 1] = row1[cursor1 + 2] = row1[cursor1 + 3] = 0;
      for (let j = 0; j < width; ++j) {
        let r = pixels[pixelIndex] & 0xff,
          g = (pixels[pixelIndex] >>> 8) & 0xff,
          b = (pixels[pixelIndex] >>> 16) & 0xff,
          a = (pixels[pixelIndex] >>> 24) & 0xff;

        let ditherPixel = calcDitherPixel(a, r, g, b, clamp, row0, cursor0, noBias);
        let r_pix = ditherPixel[0];
        let g_pix = ditherPixel[1];
        let b_pix = ditherPixel[2];
        let a_pix = ditherPixel[3];

        let c1 = (a_pix << 24) | (b_pix << 16) | (g_pix << 8) | r_pix;
        if (noBias) {
          let offset = getARGBIndex(
            a_pix,
            r_pix,
            g_pix,
            b_pix,
            this.hasSemiTransparency,
            this.m_transparentPixelIndex >= 0
          );
          if (lookup[offset] == 0) lookup[offset] = a == 0 ? 1 : nearestColorIndex(this.palette, c1, i + j) + 1;
          qPixels[pixelIndex] = lookup[offset] - 1;
        } else qPixels[pixelIndex] = a == 0 ? 0 : closestColorIndex(this.palette, c1, i + j);

        let c2 = this.palette[qPixels[pixelIndex]];
        let r2 = c2 & 0xff,
          g2 = (c2 >>> 8) & 0xff,
          b2 = (c2 >>> 16) & 0xff,
          a2 = (c2 >>> 24) & 0xff;

        r_pix = limtb[r_pix - r2 + BLOCK_SIZE];
        g_pix = limtb[g_pix - g2 + BLOCK_SIZE];
        b_pix = limtb[b_pix - b2 + BLOCK_SIZE];
        a_pix = limtb[a_pix - a2 + BLOCK_SIZE];

        let k = r_pix * 2;
        row1[cursor1 - DJ] = r_pix;
        row1[cursor1 + DJ] += r_pix += k;
        row1[cursor1] += r_pix += k;
        row0[cursor0 + DJ] += r_pix + k;

        k = g_pix * 2;
        row1[cursor1 + 1 - DJ] = g_pix;
        row1[cursor1 + 1 + DJ] += g_pix += k;
        row1[cursor1 + 1] += g_pix += k;
        row0[cursor0 + 1 + DJ] += g_pix + k;

        k = b_pix * 2;
        row1[cursor1 + 2 - DJ] = b_pix;
        row1[cursor1 + 2 + DJ] += b_pix += k;
        row1[cursor1 + 2] += b_pix += k;
        row0[cursor0 + 2 + DJ] += b_pix + k;

        k = a_pix * 2;
        row1[cursor1 + 3 - DJ] = a_pix;
        row1[cursor1 + 3 + DJ] += a_pix += k;
        row1[cursor1 + 3] += a_pix += k;
        row0[cursor0 + 3 + DJ] += a_pix + k;

        cursor0 += DJ;
        cursor1 -= DJ;
        pixelIndex += dir;
      }
      if (i % 2 == 1) pixelIndex += width + 1;

      dir *= -1;
      let temp = row0;
      row0 = row1;
      row1 = temp;
    }

    this.qPixels = qPixels;
    return this.qPixels;
  }

  for (let i = 0; i < qPixels.length; ++i) qPixels[i] = this.getDitherFn()(this.palette, pixels[i], i);

  this.qPixels = qPixels;
  return this.qPixels;
};

function processImagePixels(palette, qPixels) {
  let qPixel32s = new Uint32Array(qPixels.length);
  for (let i = 0; i < qPixels.length; ++i) qPixel32s[i] = palette[qPixels[i]];

  return qPixel32s;
}

PnnLABQuant.prototype.quantizeImage = function quantizeImage() {
  let pixels = this.opts.pixels,
    width = this.opts.width,
    height = this.opts.height,
    nMaxColors = this.opts.colors,
    dither = this.opts.dithering;
  if (this.opts.alphaThreshold) alphaThreshold = this.opts.alphaThreshold;

  pixelMap.clear();
  closestMap.clear();
  nearestMap.clear();

  let semiTransCount = 0;
  for (let i = 0; i < pixels.length; ++i) {
    let a = (pixels[i] >>> 24) & 0xff;

    if (a < 0xe0) {
      if (a == 0) {
        this.m_transparentPixelIndex = i;
        hasAlpha = true;
        if (nMaxColors > 2) this.m_transparentColor = pixels[i];
        else pixels[i] = this.m_transparentColor;
      } else if (a > alphaThreshold) ++semiTransCount;
    }
  }

  this.hasSemiTransparency = hasSemiTransparency = semiTransCount > 0;
  if (nMaxColors <= 32) PR = PG = PB = PA = 1;
  else {
    PR = coeffs[0][0];
    PG = coeffs[0][1];
    PB = coeffs[0][2];
  }

  transparentColor = this.m_transparentColor;

  this.palette = new Uint32Array(nMaxColors);
  if (nMaxColors > 2) this.pnnquan(pixels, nMaxColors);
  else {
    if (this.m_transparentPixelIndex >= 0) {
      this.palette[0] = this.m_transparentColor;
      this.palette[1] = 0xff << 24;
    } else {
      this.palette[0] = 0xff << 24;
      this.palette[1] = 0xffffffff;
    }
  }

  if (hasSemiTransparency && (semiTransCount * 1.0) / pixels.length > 0.099) this.opts.weight *= 0.01;

  if (!this.opts.dithering) {
    let delta = sqr(nMaxColors) / pixelMap.size;
    this.opts.weight = delta > 0.023 ? 1.0 : Math.fround(37.013 * delta + 0.906);
  }

  if (this.m_transparentPixelIndex >= 0) {
    let k = nearestColorIndex(this.palette, pixels[this.m_transparentPixelIndex], this.m_transparentPixelIndex);
    if (this.palette.length > 2) this.palette[k] = this.m_transparentColor;
    else if (this.palette[k] != this.m_transparentColor) {
      this.palette[0] = this.palette[k];
      this.palette[k] = this.m_transparentColor;
      nearestMap.clear();
    }
  }
  if (this.opts.paletteOnly) {
    this.opts.ditherFn = this.getDitherFn();
    this.opts.getColorIndex = this.getColorIndex;
    this.opts.palette = this.palette;
    return this.palette;
  }

  this.quantize_image(pixels, nMaxColors, width, height, dither);
  return processImagePixels(this.palette, this.qPixels);
};

PnnLABQuant.prototype.getIndexedPixels = function getIndexedPixels() {
  return this.qPixels;
};

PnnLABQuant.prototype.getPalette = function getPalette() {
  return this.palette.buffer;
};

PnnLABQuant.prototype.getImgType = function getImgType() {
  return this.opts.colors > 256 || this.hasSemiTransparency ? 'image/png' : 'image/gif';
};

PnnLABQuant.prototype.getTransparentIndex = function getTransparentIndex() {
  return this.m_transparentPixelIndex > -1 ? 0 : -1;
};

PnnLABQuant.prototype.getDitherFn = function getDitherFn() {
  return closestColorIndex;
};

PnnLABQuant.prototype.getColorIndex = function getColorIndex(a, r, g, b) {
  return getARGBIndex(a, r, g, b, this.hasSemiTransparency, this.m_transparentPixelIndex >= 0);
};

PnnLABQuant.prototype.getResult = function getResult() {
  let quant = this;
  return new Promise(function (resolve) {
    let result = quant.quantizeImage();
    if (quant.opts.paletteOnly)
      resolve({
        pal8: result,
        indexedPixels: quant.getIndexedPixels(),
        transparent: quant.getTransparentIndex(),
        type: quant.getImgType(),
      });
    else
      resolve({
        img8: result,
        pal8: quant.getPalette(),
        indexedPixels: quant.getIndexedPixels(),
        transparent: quant.getTransparentIndex(),
        type: quant.getImgType(),
      });
  });
};

PnnLABQuant.prototype.disposeTemporallyStates = function disposeTemporallyStates() {
  pixelMap.clear();
  closestMap.clear();
  nearestMap.clear();
};
