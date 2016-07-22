/**
 * An express middleware that handles errors.
 * @returns {function} an express middleware.
 */
export default function error() {
  /*eslint-disable*/
  return (err, req, res, next) => {
  /*eslint-enable*/
    if (err.status && err.status !== 500) {
      console.error(`${req.originalUrl}: ${err.stack}`);

      if (res.locals.renderErrorAsLink) {
        res.status(err.status).json({ link: {}, meta: { errorMessage: err.message } });
      } else {
        res.status(err.status).end(err.message);
      }

      return;
    }

    console.error(`${req.originalUrl}: ${err.stack}`);

    if (res.locals.renderErrorAsLink) {
      res.status(500).json({ link: {}, meta: { errorMessage: 'internal server error' } });
    } else {
      res.status(500).end('internal server error');
    }
  };
}
