/**
 * @fileOverview environment variables to be parsed to the user usecases.
 * @author Brian Omondi
 * @version 1.0.0
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

export const config = () => {
    return {
        env: process.env.NODE_ENV
    };
};