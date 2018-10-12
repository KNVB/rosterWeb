package util.servlet;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


/**
 * Servlet Filter implementation class AdminFilter
 */
public class AdminFilter implements Filter {

	protected static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	/**
     * Default constructor. 
     */
    public AdminFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here

		// pass the request along the filter chain
		String destination = ((HttpServletRequest)request).getRequestURI();
		logger.debug("destination="+destination);
		chain.doFilter(request, response);
		
		/*
		 *	if (request instanceof HttpServletRequest)
		{	
			request.setCharacterEncoding("UTF-8");
			response.setCharacterEncoding("UTF-8");
			((HttpServletResponse)response).setHeader("Cache-Control","no-cache");
			((HttpServletResponse)response).setHeader("Pragma","no-cache");
 			((HttpServletResponse)response).setDateHeader ("Expires", -1);

			final String destination = ((HttpServletRequest)request).getRequestURI();
			if(doSkipAuthentication(destination,(HttpServletRequest)request))
			{
			    chain.doFilter(request, response);
			    return;
			}
			else
			{   
				final HttpSession session = ((HttpServletRequest)request).getSession(false);
		        if (session==null||session.getAttribute("object")==null)
		       	{
		          	 final String login_page = filterConfig.getInitParameter("login_page");
		          	 filterConfig.getServletContext().getRequestDispatcher(login_page).forward(request, response);
		          	 return;
		       	}
		        else
		        {
		          	 chain.doFilter(request, response);
		        	 return;
		        }   
			}	
		}
		else
		{
			throw new ServletException("A Servlet request received.");
		} 
		 */
	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
