package com.rosterWeb.filter;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;


/**
 * Servlet Filter implementation class AdminFilter
 */
public class AdminFilter implements Filter {
	FilterConfig filterConfig;
	String []exemptedPages;
	String loginPage;
	boolean isSessionExpired=false;
	protected static final Logger logger = LogManager.getLogger(Class.class.getSimpleName());
	/**
     * Default constructor. 
     */
    public AdminFilter() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * Called by the web container to indicate to a filter that it is being taken 
     * out of service.
	 * @see Filter#destroy()
	 */
	public void destroy() 
	{
		this.filterConfig = null;
	}
	private boolean isExemptedURL(String aDestination,HttpServletRequest request)
	{
		boolean result=false;
		String temp;
		for (int i=0;i<exemptedPages.length;i++)
		{
			temp=request.getContextPath()+exemptedPages[i];
			//logger.debug("aDestination="+aDestination+",exemptedPage="+temp+",result="+aDestination.equals(temp));
			if (aDestination.equals(temp))
			{	
				result=true;
				break;
			}
		}
		logger.debug(aDestination+" is an Exempted URL="+result);
		return result; 
	}
	/**
	 *  The doFilter method of the Filter is called by the container each time a request/response pair is passed through the chain due to a client request for a resource at the end of the chain.
	 * @param request Servlet Request
	 * @param response Servlet Response
	 * @param chain Filter Chain
	 * @throws IOException The exception that was raised when during the doFilter process.
	 * @throws ServletException The exception that was raised when during the doFilter process. 
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpServletRequest httpRequest = (HttpServletRequest) request;
		HttpServletResponse httpResponse = (HttpServletResponse) response;

		final String destination = ((HttpServletRequest)request).getRequestURI();
		if(isExemptedURL(destination,(HttpServletRequest)request))
		{
		    chain.doFilter(request, response);
		    return;
		}
		else
		{
			HttpSession session = httpRequest.getSession(false);
			if((session == null)  || (session.getAttribute("isAuthenicated")==null))
			{
				if ("XMLHttpRequest".equals(httpRequest.getHeader("X-Requested-With"))) //<== this ajax call
				{		
					httpResponse.setStatus(440); // return status code 440. That mean client's session has expired and must log in again.
				}
				else
				{	
					//if it is not an ajax call,forward the client to login page.
					filterConfig.getServletContext().getRequestDispatcher(loginPage).forward(request, response);
	          	 	return;
				}
			}
			else
			{	
				if ((boolean)session.getAttribute("isAuthenicated")==true)
				{
					// pass the request along the filter chain
					chain.doFilter(request, response);
			    }
				else
				{
					//if it is not an ajax call,forward the client to login page.
					filterConfig.getServletContext().getRequestDispatcher(loginPage).forward(request, response);
	          	 	return;
				}
			}
		}
	}

	/**
	 * Called by the web container to indicate to a filter 
     * that it is being placed into service
     * @throws ServletException The exception that was raised when initialize this filter
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		this.filterConfig=fConfig;
		loginPage=filterConfig.getInitParameter("loginPage");
		exemptedPages=filterConfig.getInitParameter("exemptedPages").split(",");
	}	
}
